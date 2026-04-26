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
// ─── Read-only API functions (for Admin Dashboard) ──────────────────

export interface MailchimpCampaign {
  id: string;
  webId: number;
  title: string;
  subject: string;
  status: string;
  sendTime: string | null;
  recipients: number;
  opens: { total: number; rate: number; unique: number };
  clicks: { total: number; rate: number; unique: number };
  bounces: { hardBounces: number; softBounces: number };
  unsubscribes: number;
}

export interface MailchimpListStats {
  memberCount: number;
  unsubscribeCount: number;
  avgOpenRate: number;
  avgClickRate: number;
  campaignCount: number;
}

/**
 * Get list/audience stats from Mailchimp.
 */
export async function getMailchimpListStats(): Promise<MailchimpListStats> {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    throw new Error("Missing Mailchimp credentials");
  }

  const response = await fetch(`${BASE_URL}/lists/${MAILCHIMP_LIST_ID}?fields=stats`, {
    headers: { Authorization: AUTH_HEADER },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Mailchimp list stats failed: ${response.status}`);
  }

  const data = await response.json();
  const stats = data.stats || {};

  return {
    memberCount: stats.member_count || 0,
    unsubscribeCount: stats.unsubscribe_count || 0,
    avgOpenRate: stats.avg_open_rate || 0,
    avgClickRate: stats.click_rate || 0,
    campaignCount: stats.campaign_count || 0,
  };
}

/**
 * Get recent campaigns with their performance metrics.
 * Returns up to `count` campaigns sorted by send_time descending.
 */
export async function getMailchimpCampaigns(count: number = 20): Promise<MailchimpCampaign[]> {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    throw new Error("Missing Mailchimp credentials");
  }

  // Fetch campaigns for this list
  const url = `${BASE_URL}/campaigns?list_id=${MAILCHIMP_LIST_ID}&count=${count}&sort_field=send_time&sort_dir=DESC&fields=campaigns.id,campaigns.web_id,campaigns.settings.title,campaigns.settings.subject_line,campaigns.status,campaigns.send_time,campaigns.emails_sent,campaigns.report_summary`;

  const response = await fetch(url, {
    headers: { Authorization: AUTH_HEADER },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Mailchimp campaigns failed: ${response.status}`);
  }

  const data = await response.json();
  const campaigns = data.campaigns || [];

  return campaigns.map((c: any) => {
    const report = c.report_summary || {};
    return {
      id: c.id,
      webId: c.web_id,
      title: c.settings?.title || "Untitled",
      subject: c.settings?.subject_line || "",
      status: c.status,
      sendTime: c.send_time || null,
      recipients: c.emails_sent || 0,
      opens: {
        total: report.opens || 0,
        rate: report.open_rate || 0,
        unique: report.unique_opens || 0,
      },
      clicks: {
        total: report.clicks || 0,
        rate: report.click_rate || 0,
        unique: report.subscriber_clicks || 0,
      },
      bounces: {
        hardBounces: report.hard_bounces || 0,
        softBounces: report.soft_bounces || 0,
      },
      unsubscribes: report.unsubscribes || 0,
    };
  });
}

/**
 * Apply a single tag to an existing subscriber by email.
 * Used by Stripe webhook to tag purchasers (e.g., PROD_mappa_ia_47).
 */
export async function applyMailchimpTag(
  email: string,
  tagName: string
): Promise<{ success: boolean; error?: string }> {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    console.warn("[Mailchimp] Missing API key or List ID, skipping tag");
    return { success: false, error: "Missing Mailchimp credentials" };
  }

  const subscriberHash = md5(email);

  try {
    // First ensure the subscriber exists (upsert)
    const putRes = await fetch(
      `${BASE_URL}/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}`,
      {
        method: "PUT",
        headers: { Authorization: AUTH_HEADER, "Content-Type": "application/json" },
        body: JSON.stringify({
          email_address: email.toLowerCase().trim(),
          status_if_new: "subscribed",
        }),
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      console.error("[Mailchimp] PUT member for tag failed:", putRes.status, err);
      return { success: false, error: `PUT failed: ${putRes.status}` };
    }

    // Apply the tag
    const tagsUrl = `${BASE_URL}/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}/tags`;
    const tagsRes = await fetch(tagsUrl, {
      method: "POST",
      headers: { Authorization: AUTH_HEADER, "Content-Type": "application/json" },
      body: JSON.stringify({
        tags: [{ name: tagName, status: "active" }],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!tagsRes.ok) {
      const err = await tagsRes.json().catch(() => ({}));
      console.warn("[Mailchimp] Tag application failed:", tagsRes.status, err);
      return { success: false, error: `Tags failed: ${tagsRes.status}` };
    }

    console.log(`[Mailchimp] Tag "${tagName}" applied to ${email}`);
    return { success: true };
  } catch (err) {
    console.error("[Mailchimp] Error applying tag:", err);
    return { success: false, error: String(err) };
  }
}

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
