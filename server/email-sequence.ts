/**
 * Email Sequence Processor — Lead Nurturing Flow
 *
 * Handles the automated email sequence after a lead signs up via /lead form:
 * - D+0: "D+0 Consegna Mappa — Onboarding Il Consigliere" (template 10054956)
 * - D+3: "D+3 Follow-up — Accesso e Suggerimento Rapido" (template 10055006)
 * - D+5: "D+5 Curiosità IA — Costo Strumenti" (template 10055007)
 * - D+10: "D+10 Settimana Zero — Invito Consulenza" (template 10055008)
 * - After D+10: Apply tag "STATUS_pronto_consulenza"
 *
 * This module is called by:
 * 1. The lead form submission handler (for immediate D+0 send)
 * 2. A scheduled API endpoint (for D+3, D+5, D+10 processing)
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

/** Template IDs for the email sequence */
export const SEQUENCE_TEMPLATES = {
  d0: { id: 10054956, name: "D+0 Consegna Mappa — Onboarding Il Consigliere", subject: "*|FNAME|*, ecco la Mappa delle Opportunità IA" },
  d3: { id: 10055006, name: "D+3 Follow-up — Accesso e Suggerimento Rapido", subject: "*|FNAME|*, hai già aperto la Mappa?" },
  d5: { id: 10055007, name: "D+5 Curiosità IA — Costo Strumenti", subject: "Quanto costa davvero l'IA per una PMI?" },
  d10: { id: 10055008, name: "D+10 Settimana Zero — Invito Consulenza", subject: "*|FNAME|*, il prossimo passo: la consulenza gratuita" },
} as const;

export type SequenceStep = keyof typeof SEQUENCE_TEMPLATES;

/**
 * Send a single email from a template to a specific subscriber.
 * Uses Mailchimp's campaign creation + send workflow (one-off campaign to single recipient).
 */
export async function sendTemplateEmail(
  email: string,
  step: SequenceStep
): Promise<{ success: boolean; campaignId?: string; error?: string }> {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    return { success: false, error: "Missing Mailchimp credentials" };
  }

  const template = SEQUENCE_TEMPLATES[step];

  try {
    // Step 1: Create a campaign targeting this specific subscriber
    const createRes = await fetch(`${BASE_URL}/campaigns`, {
      method: "POST",
      headers: { Authorization: AUTH_HEADER, "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "regular",
        recipients: {
          list_id: MAILCHIMP_LIST_ID,
          segment_opts: {
            match: "all",
            conditions: [{
              condition_type: "EmailAddress",
              field: "EMAIL",
              op: "is",
              value: email.toLowerCase().trim(),
            }],
          },
        },
        settings: {
          subject_line: template.subject,
          title: `[Auto] ${template.name} — ${email}`,
          from_name: "Lamberto Grinover",
          reply_to: "lamberto@ilconsigliere.io",
          template_id: template.id,
        },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      console.error(`[EmailSequence] Failed to create campaign for ${step}:`, createRes.status, err);
      return { success: false, error: `Create campaign failed: ${createRes.status}` };
    }

    const campaign = await createRes.json();
    const campaignId = campaign.id;

    // Step 2: Send the campaign
    const sendRes = await fetch(`${BASE_URL}/campaigns/${campaignId}/actions/send`, {
      method: "POST",
      headers: { Authorization: AUTH_HEADER, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
    });

    if (!sendRes.ok) {
      const err = await sendRes.json().catch(() => ({}));
      console.error(`[EmailSequence] Failed to send campaign ${campaignId}:`, sendRes.status, err);
      return { success: false, campaignId, error: `Send failed: ${sendRes.status}` };
    }

    console.log(`[EmailSequence] ✓ Sent ${step} email to ${email} (campaign: ${campaignId})`);
    return { success: true, campaignId };
  } catch (err) {
    console.error(`[EmailSequence] Error sending ${step} to ${email}:`, err);
    return { success: false, error: String(err) };
  }
}

/**
 * Apply the STATUS_pronto_consulenza tag to a subscriber.
 * Called after D+10 email is sent — marks lead as ready for Calendly invite.
 */
export async function applyConsulenzaTag(
  email: string
): Promise<{ success: boolean; error?: string }> {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    return { success: false, error: "Missing Mailchimp credentials" };
  }

  const subscriberHash = md5(email);
  const tagsUrl = `${BASE_URL}/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}/tags`;

  try {
    const res = await fetch(tagsUrl, {
      method: "POST",
      headers: { Authorization: AUTH_HEADER, "Content-Type": "application/json" },
      body: JSON.stringify({
        tags: [{ name: "STATUS_pronto_consulenza", status: "active" }],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: `Tag failed: ${res.status}` };
    }

    console.log(`[EmailSequence] ✓ Tag STATUS_pronto_consulenza applied to ${email}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
