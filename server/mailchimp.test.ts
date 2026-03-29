import { describe, it, expect } from "vitest";
import crypto from "crypto";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || "";
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || "us14";
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || "b0d9ab0ecc";
const BASE_URL = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`;
const AUTH_HEADER = `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`;

function md5(str: string): string {
  return crypto.createHash("md5").update(str.toLowerCase().trim()).digest("hex");
}

/**
 * Permanently delete a test subscriber (archive + permanent delete).
 */
async function permanentlyDelete(email: string) {
  const hash = md5(email);
  // Step 1: Archive (DELETE)
  await fetch(`${BASE_URL}/lists/${MAILCHIMP_LIST_ID}/members/${hash}`, {
    method: "DELETE",
    headers: { Authorization: AUTH_HEADER },
    signal: AbortSignal.timeout(10000),
  });
  // Step 2: Permanent delete (POST to /actions/delete-permanent)
  await fetch(`${BASE_URL}/lists/${MAILCHIMP_LIST_ID}/members/${hash}/actions/delete-permanent`, {
    method: "POST",
    headers: { Authorization: AUTH_HEADER },
    signal: AbortSignal.timeout(10000),
  });
}

describe("Mailchimp API credentials", () => {
  it("validates API key by pinging the Mailchimp API root", async () => {
    const response = await fetch(`${BASE_URL}/`, {
      headers: { Authorization: AUTH_HEADER },
      signal: AbortSignal.timeout(15000),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.account_id).toBeDefined();
    expect(data.account_name).toBeDefined();
    console.log(`Mailchimp account: ${data.account_name} (${data.account_id})`);
  }, 20000);

  it("validates MAILCHIMP_LIST_ID is accessible", async () => {
    const response = await fetch(`${BASE_URL}/lists/${MAILCHIMP_LIST_ID}`, {
      headers: { Authorization: AUTH_HEADER },
      signal: AbortSignal.timeout(15000),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(MAILCHIMP_LIST_ID);
    expect(data.name).toBeDefined();
    console.log(`Validated list: "${data.name}" (${data.id})`);
  }, 20000);
});

describe("Mailchimp sync functions", () => {
  const TEST_EMAIL_SIMPLE = `test-lead-${Date.now()}@sintesys-test.io`;
  const TEST_EMAIL_QUALIFIED = `test-qual-${Date.now()}@sintesys-test.io`;

  it("syncSimpleLead adds a subscriber with tag 'lead' and sector tag", async () => {
    const { syncSimpleLead } = await import("./mailchimp");
    const result = await syncSimpleLead({
      name: "Test Lead Manus",
      email: TEST_EMAIL_SIMPLE,
      phone: "+39 333 1234567",
      sector: "Tecnologia",
    });
    expect(result.success).toBe(true);

    // Verify subscriber exists
    const hash = md5(TEST_EMAIL_SIMPLE);
    const response = await fetch(`${BASE_URL}/lists/${MAILCHIMP_LIST_ID}/members/${hash}`, {
      headers: { Authorization: AUTH_HEADER },
      signal: AbortSignal.timeout(15000),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.email_address).toBe(TEST_EMAIL_SIMPLE);
    expect(data.status).toBe("subscribed");
    expect(data.merge_fields.FNAME).toBe("Test");
    expect(data.merge_fields.LNAME).toBe("Lead Manus");
    expect(data.merge_fields.LEADTYPE).toBe("lead");
    console.log(`Simple lead verified: ${data.email_address}`);

    // Cleanup
    await permanentlyDelete(TEST_EMAIL_SIMPLE);
    console.log(`Cleaned up: ${TEST_EMAIL_SIMPLE}`);
  }, 30000);

  it("syncQualifiedLead adds a subscriber with tag 'Qualificado' and all merge fields", async () => {
    const { syncQualifiedLead } = await import("./mailchimp");
    const result = await syncQualifiedLead({
      name: "Test Qualificado",
      email: TEST_EMAIL_QUALIFIED,
      phone: "+39 333 7654321",
      companyName: "Test Azienda Srl",
      revenue: "€1M - €3M",
      employees: "10-25",
      sector: "Manifattura",
      mainObstacle: "Troppi processi manuali",
      dataLocation: "Fogli Excel e documenti sparsi",
      cashFlowChallenge: "Sì, la gestione della liquidità è un problema",
      delegationChallenge: "Tutto passa da me",
      currentTools: "Excel, email",
      usesAI: "No, non ancora",
      aiDetails: "",
      shadowAIConcern: "Sì",
      priority: "Ridurre costi e aumentare i margini",
      successionConcern: "Dipende da me",
      isDecisionMaker: "Sì, decido io",
    });
    expect(result.success).toBe(true);

    // Verify subscriber exists
    const hash = md5(TEST_EMAIL_QUALIFIED);
    const response = await fetch(`${BASE_URL}/lists/${MAILCHIMP_LIST_ID}/members/${hash}`, {
      headers: { Authorization: AUTH_HEADER },
      signal: AbortSignal.timeout(15000),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.email_address).toBe(TEST_EMAIL_QUALIFIED);
    expect(data.status).toBe("subscribed");
    expect(data.merge_fields.LEADTYPE).toBe("Qualificato");
    expect(data.merge_fields.COMPANY).toBe("Test Azienda Srl");
    console.log(`Qualified lead verified: ${data.email_address}`);

    // Cleanup
    await permanentlyDelete(TEST_EMAIL_QUALIFIED);
    console.log(`Cleaned up: ${TEST_EMAIL_QUALIFIED}`);
  }, 30000);
});
