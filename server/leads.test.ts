import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  createLead: vi.fn(),
  getLeadByEmail: vi.fn(),
  getAllLeads: vi.fn(),
}));

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the storage module
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({
    key: "leads/test.xlsx",
    url: "https://cdn.example.com/leads/test.xlsx",
  }),
}));

import { createLead, getLeadByEmail, getAllLeads } from "./db";

const mockedCreateLead = vi.mocked(createLead);
const mockedGetLeadByEmail = vi.mocked(getLeadByEmail);
const mockedGetAllLeads = vi.mocked(getAllLeads);

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@test.com",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@test.com",
      name: "User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("leads.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new lead and returns success", async () => {
    const now = new Date();
    mockedGetLeadByEmail.mockResolvedValue(undefined);
    mockedCreateLead.mockResolvedValue({
      id: 1,
      name: "Marco Rossi",
      email: "marco@azienda.it",
      phone: "+39 333 1234567",
      sector: "Manifattura",
      source: "landing_page",
      createdAt: now,
    });

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.leads.submit({
      name: "Marco Rossi",
      email: "marco@azienda.it",
      phone: "+39 333 1234567",
      sector: "Manifattura",
    });

    expect(result.success).toBe(true);
    expect(result.duplicate).toBe(false);
    expect(mockedCreateLead).toHaveBeenCalledWith({
      name: "Marco Rossi",
      email: "marco@azienda.it",
      phone: "+39 333 1234567",
      sector: "Manifattura",
      source: "landing_page",
    });
  });

  it("returns duplicate flag when email already exists", async () => {
    mockedGetLeadByEmail.mockResolvedValue({
      id: 1,
      name: "Marco Rossi",
      email: "marco@azienda.it",
      phone: "+39 333 1234567",
      sector: "Manifattura",
      source: "landing_page",
      createdAt: new Date(),
    });

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.leads.submit({
      name: "Marco Rossi",
      email: "marco@azienda.it",
      sector: "Manifattura",
    });

    expect(result.success).toBe(true);
    expect(result.duplicate).toBe(true);
    expect(mockedCreateLead).not.toHaveBeenCalled();
  });

  it("validates email format", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.leads.submit({
        name: "Marco Rossi",
        email: "invalid-email",
        sector: "Manifattura",
      })
    ).rejects.toThrow();
  });

  it("validates required name", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.leads.submit({
        name: "",
        email: "marco@azienda.it",
        sector: "Manifattura",
      })
    ).rejects.toThrow();
  });
});

describe("leads.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all leads for admin users", async () => {
    const mockLeads = [
      {
        id: 1,
        name: "Marco Rossi",
        email: "marco@azienda.it",
        phone: "+39 333 1234567",
        sector: "Manifattura",
        source: "landing_page",
        createdAt: new Date(),
      },
    ];
    mockedGetAllLeads.mockResolvedValue(mockLeads);

    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.leads.list();

    expect(result).toEqual(mockLeads);
    expect(mockedGetAllLeads).toHaveBeenCalled();
  });

  it("throws error for non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());

    await expect(caller.leads.list()).rejects.toThrow("Accesso non autorizzato");
  });
});

describe("leads.exportSpreadsheet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates spreadsheet and returns URL for admin", async () => {
    mockedGetAllLeads.mockResolvedValue([
      {
        id: 1,
        name: "Marco Rossi",
        email: "marco@azienda.it",
        phone: "+39 333 1234567",
        sector: "Manifattura",
        source: "landing_page",
        createdAt: new Date("2026-03-28T10:00:00Z"),
      },
      {
        id: 2,
        name: "Giulia Bianchi",
        email: "giulia@servizi.it",
        phone: null,
        sector: "Servizi professionali",
        source: "landing_page",
        createdAt: new Date("2026-03-28T11:00:00Z"),
      },
    ]);

    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.leads.exportSpreadsheet();

    expect(result.success).toBe(true);
    expect(result.url).toBe("https://cdn.example.com/leads/test.xlsx");
    expect(mockedGetAllLeads).toHaveBeenCalled();
  });

  it("throws error for non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());

    await expect(caller.leads.exportSpreadsheet()).rejects.toThrow(
      "Accesso non autorizzato"
    );
  });
});
