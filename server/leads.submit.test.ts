import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for the leads.submit public procedure.
 * Verifies input validation and successful lead creation flow.
 */

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

describe("leads.submit", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });


  it("rejects submission with invalid email", async () => {
    await expect(
      caller.leads.submit({
        name: "Mario Rossi",
        email: "invalid-email",
        phone: "+39 333 1234567",
        sector: "Manifattura",
        source: "lead_page",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with empty name", async () => {
    await expect(
      caller.leads.submit({
        name: "",
        email: "mario@azienda.it",
        phone: "+39 333 1234567",
        sector: "Manifattura",
        source: "lead_page",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with name too short", async () => {
    await expect(
      caller.leads.submit({
        name: "M",
        email: "mario@azienda.it",
        phone: "+39 333 1234567",
        sector: "Manifattura",
        source: "lead_page",
      })
    ).rejects.toThrow();
  });

  it("accepts valid lead submission with all fields", async () => {
    // This test will interact with the actual DB if available
    // In CI/test environments, it validates the procedure accepts valid input
    const result = await caller.leads.submit({
      name: "Mario Rossi",
      email: `test-${Date.now()}@example.it`,
      phone: "+39 333 1234567",
      sector: "Manifattura",
      source: "lead_page",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  }, 30000);

  it("accepts submission without optional phone field", async () => {
    const result = await caller.leads.submit({
      name: "Luigi Bianchi",
      email: `test-nophone-${Date.now()}@example.it`,
      source: "lead_page",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  }, 30000);

  it("handles duplicate email gracefully", async () => {
    const email = `test-dup-${Date.now()}@example.it`;

    // First submission
    await caller.leads.submit({
      name: "First User",
      email,
      source: "lead_page",
    });

    // Second submission with same email
    const result = await caller.leads.submit({
      name: "Second User",
      email,
      source: "lead_page",
    });

    expect(result.success).toBe(true);
    expect(result.duplicate).toBe(true);
  }, 60000);
});
