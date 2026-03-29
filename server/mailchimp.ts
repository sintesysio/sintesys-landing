/**
 * Mailchimp Marketing API Integration
 *
 * Handles adding/updating subscribers with merge fields and tags.
 * Uses PUT (upsert) to avoid duplicate errors.
 *
 * Tags used:
 * - "lead" → from popup form (simple lead magnet)
 * - "Qualificato" → from Contattaci form (qualified lead)
 * - Sector tag (e.g., "manifattura", "commercio") → for sector-specific automations
 */

import crypto from "crypto";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || "";
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || "us14";
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || "";
const BASE_URL = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`;
const AUTH_HEADER = `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`;

function md5(str: string): string {
  return crypto.createHash("md5").update(str.toLowerCase().trim()).digest("hex");
}

/**
 * Normalize sector name to a clean tag (lowercase, no spaces).
 */
function sectorToTag(sector: string): string {
  const map: Record<string, string> = {
    "Manifattura": "manifattura",
    "Commercio all'ingrosso": "commercio-ingrosso",
    "Commercio al dettaglio": "commercio-dettaglio",
    "Servizi professionali": "servizi-professionali",
    "Costruzioni": "costruzioni",
    "Logistica e trasporti": "logistica-trasporti",
    "Ristorazione e hospitality": "ristorazione-hospitality",
    "Tecnologia": "tecnologia",
    "Altro": "altro",
  };
  return map[sector] || sector.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/**
 * Split a full name into first and last name.
 */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

export interface SimpleLeadData {
  name: string;
  email: string;
  phone?: string | null;
  sector: string;
}

export interface QualifiedLeadData {
  name: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  revenue: string;
  employees: string;
  sector: string;
  mainObstacle: string;
  dataLocation: string;
  cashFlowChallenge?: string | null;
  delegationChallenge?: string | null;
  currentTools?: string | null;
  usesAI: string;
  aiDetails?: string | null;
  shadowAIConcern?: string | null;
  priority: string;
  successionConcern?: string | null;
  isDecisionMaker: string;
}

/**
 * Add or update a subscriber in Mailchimp (upsert via PUT).
 */
async function upsertSubscriber(
  email: string,
  mergeFields: Record<string, string>,
  tags: string[]
): Promise<{ success: boolean; error?: string }> {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    console.warn("[Mailchimp] Missing API key or List ID, skipping sync");
    return { success: false, error: "Missing Mailchimp credentials" };
  }

  const subscriberHash = md5(email);
  const url = `${BASE_URL}/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}`;

  try {
    // Step 1: Upsert the member with merge fields
    const putResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: AUTH_HEADER,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email.toLowerCase().trim(),
        status_if_new: "subscribed",
        merge_fields: mergeFields,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!putResponse.ok) {
      const errorData = await putResponse.json().catch(() => ({}));
      console.error("[Mailchimp] PUT member failed:", putResponse.status, errorData);
      return { success: false, error: `PUT failed: ${putResponse.status}` };
    }

    // Step 2: Apply tags (separate API call)
    if (tags.length > 0) {
      const tagsUrl = `${BASE_URL}/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}/tags`;
      const tagsBody = {
        tags: tags.map((tag) => ({ name: tag, status: "active" as const })),
      };

      const tagsResponse = await fetch(tagsUrl, {
        method: "POST",
        headers: {
          Authorization: AUTH_HEADER,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tagsBody),
        signal: AbortSignal.timeout(10000),
      });

      if (!tagsResponse.ok) {
        const tagsError = await tagsResponse.json().catch(() => ({}));
        console.warn("[Mailchimp] Tags update failed:", tagsResponse.status, tagsError);
        // Don't fail the whole operation for tags
      }
    }

    console.log(`[Mailchimp] Synced subscriber: ${email} with tags: [${tags.join(", ")}]`);
    return { success: true };
  } catch (err) {
    console.error("[Mailchimp] Error syncing subscriber:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Sync a simple lead (from popup form) to Mailchimp.
 * Tags: "lead" + sector tag
 */
export async function syncSimpleLead(data: SimpleLeadData): Promise<{ success: boolean; error?: string }> {
  const { firstName, lastName } = splitName(data.name);

  const mergeFields: Record<string, string> = {
    FNAME: firstName,
    LNAME: lastName,
    PHONE: data.phone || "",
    SECTOR: data.sector,
    LEADTYPE: "lead",
  };

  const tags = ["lead", sectorToTag(data.sector)];

  return upsertSubscriber(data.email, mergeFields, tags);
}

/**
 * Sync a qualified lead (from Contattaci form) to Mailchimp.
 * Tags: "Qualificado" + sector tag
 * Includes all qualification merge fields.
 */
export async function syncQualifiedLead(data: QualifiedLeadData): Promise<{ success: boolean; error?: string }> {
  const { firstName, lastName } = splitName(data.name);

  const mergeFields: Record<string, string> = {
    FNAME: firstName,
    LNAME: lastName,
    PHONE: data.phone || "",
    COMPANY: data.companyName || "",
    SECTOR: data.sector,
    REVENUE: data.revenue,
    EMPLOYEE: data.employees,
    LEADTYPE: "Qualificato",
    OBSTACLE: data.mainObstacle,
    DATALOC: data.dataLocation,
    CASHFLOW: data.cashFlowChallenge || "",
    DELEGAT: data.delegationChallenge || "",
    TOOLS: data.currentTools || "",
    USESAI: data.usesAI,
    AIDETAIL: data.aiDetails || "",
    SHADOWAI: data.shadowAIConcern || "",
    PRIORITY: data.priority,
    SUCCESSI: data.successionConcern || "",
    DECISION: data.isDecisionMaker,
  };

  const tags = ["Qualificato", sectorToTag(data.sector)];

  return upsertSubscriber(data.email, mergeFields, tags);
}
