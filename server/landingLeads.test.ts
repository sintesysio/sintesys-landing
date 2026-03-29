import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock all external integrations
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    createQualifiedLead: vi.fn().mockResolvedValue({
      id: 1,
      name: "Mario Rossi",
      email: "mario@azienda.it",
      phone: "+39 333 1234567",
      companyName: null,
      revenue: "€1M – €3M",
      employees: "11 – 25",
      sector: "Manifattura",
      mainObstacle: "Da valutare in audit",
      dataLocation: "Da valutare in audit",
      cashFlowChallenge: null,
      delegationChallenge: null,
      currentTools: null,
      usesAI: "non_so",
      aiDetails: null,
      shadowAIConcern: null,
      priority: "Audit richiesto via Landing Page",
      successionConcern: null,
      isDecisionMaker: "si",
      createdAt: new Date(),
    }),
    getQualifiedLeadByEmail: vi.fn().mockResolvedValue(undefined),
    getLeadByEmail: vi.fn().mockResolvedValue(undefined),
    getAllQualifiedLeads: vi.fn().mockResolvedValue([]),
    createLead: vi.fn(),
    getAllLeads: vi.fn().mockResolvedValue([]),
  };
});

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./mailchimp", () => ({
  syncSimpleLead: vi.fn().mockResolvedValue({ success: true }),
  syncQualifiedLead: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("./notion", () => ({
  syncSimpleLeadToNotion: vi.fn().mockResolvedValue(undefined),
  syncQualifiedLeadToNotion: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({
    key: "leads/test.xlsx",
    url: "https://cdn.example.com/leads/test.xlsx",
  }),
}));

import { createQualifiedLead, getQualifiedLeadByEmail } from "./db";
import { syncQualifiedLead } from "./mailchimp";
import { syncQualifiedLeadToNotion } from "./notion";
import { notifyOwner } from "./_core/notification";

const mockedCreateQualifiedLead = vi.mocked(createQualifiedLead);
const mockedGetQualifiedLeadByEmail = vi.mocked(getQualifiedLeadByEmail);
const mockedSyncQualifiedLead = vi.mocked(syncQualifiedLead);
const mockedSyncToNotion = vi.mocked(syncQualifiedLeadToNotion);
const mockedNotifyOwner = vi.mocked(notifyOwner);

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("landingLeads.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetQualifiedLeadByEmail.mockResolvedValue(undefined);
    mockedCreateQualifiedLead.mockResolvedValue({
      id: 1,
      name: "Mario Rossi",
      email: "mario@azienda.it",
      phone: "+39 333 1234567",
      companyName: null,
      revenue: "€1M – €3M",
      employees: "11 – 25",
      sector: "Manifattura",
      mainObstacle: "Da valutare in audit",
      dataLocation: "Da valutare in audit",
      cashFlowChallenge: null,
      delegationChallenge: null,
      currentTools: null,
      usesAI: "non_so",
      aiDetails: null,
      shadowAIConcern: null,
      priority: "Audit richiesto via Landing Page",
      successionConcern: null,
      isDecisionMaker: "si",
      createdAt: new Date(),
    });
  });

  it("creates a qualified lead with simplified 6-field form and returns success", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.landingLeads.submit({
      name: "Mario Rossi",
      email: "mario@azienda.it",
      phone: "+39 333 1234567",
      sector: "Manifattura",
      revenue: "€1M – €3M",
      employees: "11 – 25",
    });

    expect(result.success).toBe(true);
    expect(result.duplicate).toBe(false);
    expect(result.message).toBe("Audit inviato");

    // Verify createQualifiedLead was called with correct defaults for missing fields
    expect(mockedCreateQualifiedLead).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Mario Rossi",
        email: "mario@azienda.it",
        phone: "+39 333 1234567",
        sector: "Manifattura",
        revenue: "€1M – €3M",
        employees: "11 – 25",
        companyName: null,
        mainObstacle: "Da valutare in audit",
        dataLocation: "Da valutare in audit",
        usesAI: "non_so",
        isDecisionMaker: "si",
        priority: "Audit richiesto via Landing Page",
      })
    );
  });

  it("syncs to Mailchimp with tag Qualificato", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await caller.landingLeads.submit({
      name: "Mario Rossi",
      email: "mario@azienda.it",
      sector: "Manifattura",
      revenue: "€1M – €3M",
      employees: "11 – 25",
    });

    expect(mockedSyncQualifiedLead).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Mario Rossi",
        email: "mario@azienda.it",
        sector: "Manifattura",
        revenue: "€1M – €3M",
        employees: "11 – 25",
        isDecisionMaker: "si",
      })
    );
  });

  it("syncs to Notion CRM with qualified status", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await caller.landingLeads.submit({
      name: "Mario Rossi",
      email: "mario@azienda.it",
      sector: "Manifattura",
      revenue: "€1M – €3M",
      employees: "11 – 25",
    });

    expect(mockedSyncToNotion).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Mario Rossi",
        email: "mario@azienda.it",
        sector: "Manifattura",
        revenue: "€1M – €3M",
        employees: "11 – 25",
      })
    );
  });

  it("notifies owner about new landing page lead", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await caller.landingLeads.submit({
      name: "Mario Rossi",
      email: "mario@azienda.it",
      sector: "Manifattura",
      revenue: "€1M – €3M",
      employees: "11 – 25",
    });

    expect(mockedNotifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Nuovo Lead LP: Mario Rossi",
      })
    );
  });

  it("returns duplicate flag when email already exists in qualified leads", async () => {
    mockedGetQualifiedLeadByEmail.mockResolvedValue({
      id: 1,
      name: "Mario Rossi",
      email: "mario@azienda.it",
      phone: "+39 333 1234567",
      companyName: null,
      revenue: "€1M – €3M",
      employees: "11 – 25",
      sector: "Manifattura",
      mainObstacle: "Da valutare in audit",
      dataLocation: "Da valutare in audit",
      cashFlowChallenge: null,
      delegationChallenge: null,
      currentTools: null,
      usesAI: "non_so",
      aiDetails: null,
      shadowAIConcern: null,
      priority: "Audit richiesto via Landing Page",
      successionConcern: null,
      isDecisionMaker: "si",
      createdAt: new Date(),
    });

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.landingLeads.submit({
      name: "Mario Rossi",
      email: "mario@azienda.it",
      sector: "Manifattura",
      revenue: "€1M – €3M",
      employees: "11 – 25",
    });

    expect(result.success).toBe(true);
    expect(result.duplicate).toBe(true);
    expect(mockedCreateQualifiedLead).not.toHaveBeenCalled();
  });

  it("validates required fields - missing name", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.landingLeads.submit({
        name: "",
        email: "mario@azienda.it",
        sector: "Manifattura",
        revenue: "€1M – €3M",
        employees: "11 – 25",
      })
    ).rejects.toThrow();
  });

  it("validates email format", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.landingLeads.submit({
        name: "Mario Rossi",
        email: "invalid-email",
        sector: "Manifattura",
        revenue: "€1M – €3M",
        employees: "11 – 25",
      })
    ).rejects.toThrow();
  });

  it("validates required sector", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.landingLeads.submit({
        name: "Mario Rossi",
        email: "mario@azienda.it",
        sector: "",
        revenue: "€1M – €3M",
        employees: "11 – 25",
      })
    ).rejects.toThrow();
  });

  it("validates required revenue", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.landingLeads.submit({
        name: "Mario Rossi",
        email: "mario@azienda.it",
        sector: "Manifattura",
        revenue: "",
        employees: "11 – 25",
      })
    ).rejects.toThrow();
  });

  it("validates required employees", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.landingLeads.submit({
        name: "Mario Rossi",
        email: "mario@azienda.it",
        sector: "Manifattura",
        revenue: "€1M – €3M",
        employees: "",
      })
    ).rejects.toThrow();
  });

  it("accepts submission without optional phone", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.landingLeads.submit({
      name: "Giulia Bianchi",
      email: "giulia@servizi.it",
      sector: "Servizi professionali",
      revenue: "€500K – €1M",
      employees: "6 – 10",
    });

    expect(result.success).toBe(true);
    expect(result.duplicate).toBe(false);
  });

  it("has correct router procedure defined", () => {
    expect(appRouter).toBeDefined();
    expect(appRouter._def.procedures).toHaveProperty("landingLeads.submit");
  });
});
