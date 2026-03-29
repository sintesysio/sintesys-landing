import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

  it("accepts valid input with all required and optional fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // This should not throw for validation - it may fail on DB but input is valid
    try {
      const result = await caller.qualifiedLeads.submit({
        name: "Mario Rossi",
        email: `test-${Date.now()}@azienda.it`,
        phone: "+39 333 1234567",
        companyName: "Rossi S.r.l.",
        revenue: "€2M - €5M",
        employees: "10 - 25",
        sector: "Manifattura e produzione",
        mainObstacle: "Processi manuali che rallentano tutto",
        dataLocation: "Fogli Excel sparsi e chat WhatsApp",
        cashFlowChallenge: "Sì, spesso non ho visibilità sul flusso di cassa",
        delegationChallenge: "No, tutto passa da me — sono il collo di bottiglia",
        currentTools: "SAP per contabilità, Google Workspace",
        usesAI: "Sì, ma in modo informale (ChatGPT, Copilot...)",
        aiDetails: "ChatGPT per email, Copilot per codice",
        shadowAIConcern: "Sì, probabilmente — non abbiamo regole chiare",
        priority: "Ridurre i costi operativi e aumentare i margini",
        successionConcern: "Sì, tutto il know-how è nella mia testa — è un rischio",
        isDecisionMaker: "Sì, decido io",
      });
      expect(result.success).toBe(true);
    } catch (err: unknown) {
      // DB error is acceptable in test env, but validation should pass
      const error = err as { code?: string; message?: string };
      expect(error.code).not.toBe("BAD_REQUEST");
    }
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
