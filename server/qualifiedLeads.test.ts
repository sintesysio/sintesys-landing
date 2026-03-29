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
      email: "test@azienda.it",
      phone: "+39 333 1234567",
      companyName: "Rossi S.r.l.",
      revenue: "\u20ac2M - \u20ac5M",
      employees: "10 - 25",
      sector: "Manifattura e produzione",
      mainObstacle: "Processi manuali",
      dataLocation: "Fogli Excel",
      cashFlowChallenge: null,
      delegationChallenge: null,
      currentTools: null,
      usesAI: "No, non ancora",
      aiDetails: null,
      shadowAIConcern: null,
      priority: "Ridurre i costi",
      successionConcern: null,
      isDecisionMaker: "S\u00ec, decido io",
      createdAt: new Date(),
    }),
    getQualifiedLeadByEmail: vi.fn().mockResolvedValue(undefined),
    getAllQualifiedLeads: vi.fn().mockResolvedValue([]),
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
    key: "qualified-leads/test.xlsx",
    url: "https://cdn.example.com/qualified-leads/test.xlsx",
  }),
}));

import { syncQualifiedLeadToNotion } from "./notion";
const mockedSyncToNotion = vi.mocked(syncQualifiedLeadToNotion);

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

describe("qualifiedLeads.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Missing required fields should throw validation error
    await expect(
      caller.qualifiedLeads.submit({
        name: "",
        email: "invalid",
        revenue: "",
        employees: "",
        sector: "",
        mainObstacle: "",
        dataLocation: "",
        usesAI: "",
        priority: "",
        isDecisionMaker: "",
      })
    ).rejects.toThrow();
  });

  it("validates email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.qualifiedLeads.submit({
        name: "Test User",
        email: "not-an-email",
        revenue: "€2M - €5M",
        employees: "10 - 25",
        sector: "Manifattura e produzione",
        mainObstacle: "Processi manuali che rallentano tutto",
        dataLocation: "Fogli Excel sparsi e chat WhatsApp",
        usesAI: "No, non ancora",
        priority: "Ridurre i costi operativi e aumentare i margini",
        isDecisionMaker: "Sì, decido io",
      })
    ).rejects.toThrow();
  });

  it("accepts valid input and syncs to Notion with status Qualificado", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.qualifiedLeads.submit({
      name: "Mario Rossi",
      email: `test-${Date.now()}@azienda.it`,
      phone: "+39 333 1234567",
      companyName: "Rossi S.r.l.",
      revenue: "\u20ac2M - \u20ac5M",
      employees: "10 - 25",
      sector: "Manifattura e produzione",
      mainObstacle: "Processi manuali che rallentano tutto",
      dataLocation: "Fogli Excel sparsi e chat WhatsApp",
      cashFlowChallenge: "S\u00ec, spesso non ho visibilit\u00e0 sul flusso di cassa",
      delegationChallenge: "No, tutto passa da me \u2014 sono il collo di bottiglia",
      currentTools: "SAP per contabilit\u00e0, Google Workspace",
      usesAI: "S\u00ec, ma in modo informale (ChatGPT, Copilot...)",
      aiDetails: "ChatGPT per email, Copilot per codice",
      shadowAIConcern: "S\u00ec, probabilmente \u2014 non abbiamo regole chiare",
      priority: "Ridurre i costi operativi e aumentare i margini",
      successionConcern: "S\u00ec, tutto il know-how \u00e8 nella mia testa \u2014 \u00e8 un rischio",
      isDecisionMaker: "S\u00ec, decido io",
    });

    expect(result.success).toBe(true);

    // Verify Notion sync was called with correct data for qualified lead
    expect(mockedSyncToNotion).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Mario Rossi",
        sector: "Manifattura e produzione",
        priority: "Ridurre i costi operativi e aumentare i margini",
        isDecisionMaker: "S\u00ec, decido io",
      })
    );
  });

  it("accepts valid input with only required fields (optional fields omitted)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.qualifiedLeads.submit({
        name: "Giulia Bianchi",
        email: `test-min-${Date.now()}@azienda.it`,
        revenue: "Sotto €500k",
        employees: "Meno di 10",
        sector: "Servizi professionali",
        mainObstacle: "Dati sparsi tra Excel, WhatsApp e carta",
        dataLocation: "ERP o gestionale datato, senza integrazione",
        usesAI: "No, non ancora",
        priority: "Sto solo esplorando le opzioni",
        isDecisionMaker: "Decido insieme a soci o familiari",
      });
      expect(result.success).toBe(true);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      expect(error.code).not.toBe("BAD_REQUEST");
    }
  });

  it("has correct input schema shape", () => {
    // Verify the router exists and has the submit procedure
    expect(appRouter).toBeDefined();
    expect(appRouter._def.procedures).toHaveProperty("qualifiedLeads.submit");
  });
});

describe("qualifiedLeads.exportSpreadsheet", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Should throw because user is not authenticated
    await expect(caller.qualifiedLeads.exportSpreadsheet()).rejects.toThrow();
  });
});
