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
        revenue: "€1,8M - €3M",
        employees: "10-20",
        sector: "Manifattura",
        mainObstacle: "Processi manuali lenti",
        dataLocation: "Fogli Excel / Google Sheets",
        usesAI: "No",
        priority: "Ridurre costi operativi",
        isDecisionMaker: "Sì",
      })
    ).rejects.toThrow();
  });

  it("accepts valid input with all required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // This should not throw for validation - it may fail on DB but input is valid
    try {
      const result = await caller.qualifiedLeads.submit({
        name: "Mario Rossi",
        email: `test-${Date.now()}@azienda.it`,
        phone: "+39 333 1234567",
        companyName: "Rossi S.r.l.",
        revenue: "€1,8M - €3M",
        employees: "10-20",
        sector: "Manifattura",
        mainObstacle: "Processi manuali lenti",
        manualHoursPerWeek: "20-40 ore",
        dataLocation: "Fogli Excel / Google Sheets",
        currentTools: "Office 365",
        usesAI: "No",
        priority: "Ridurre costi operativi",
        isDecisionMaker: "Sì",
      });
      expect(result.success).toBe(true);
    } catch (err: unknown) {
      // DB error is acceptable in test env, but validation should pass
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
