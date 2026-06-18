/**
 * Scheduled Email Sequence Endpoint — /api/scheduled/email-sequence
 *
 * Called by a scheduled task (every 6 hours) to process the lead nurturing email sequence.
 * Checks all leads that haven't completed the full sequence and sends emails based on elapsed days:
 * - D+3: Follow-up email
 * - D+5: Curiosità IA email
 * - D+10: Invito Consulenza email + apply tag STATUS_pronto_consulenza
 *
 * D+0 is sent immediately by the lead form submission handler, not by this endpoint.
 */

import type { Express, Request, Response } from "express";
import { getPendingLeadEmailSequence, markLeadEmailSent, markLeadConsulenzaTagApplied } from "./db";
import { sendTemplateEmail, applyConsulenzaTag } from "./email-sequence";

/** Calculate days elapsed since lead signup */
function daysElapsed(createdAt: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function registerScheduledEmailSequence(app: Express) {
  app.post("/api/scheduled/email-sequence", async (req: Request, res: Response) => {
    console.log("[Scheduled] Lead email sequence processor started");

    try {
      const pendingLeads = await getPendingLeadEmailSequence();
      console.log(`[Scheduled] Found ${pendingLeads.length} leads pending email sequence`);

      const results = {
        processed: 0,
        d3Sent: 0,
        d5Sent: 0,
        d10Sent: 0,
        tagsApplied: 0,
        errors: [] as string[],
      };

      for (const lead of pendingLeads) {
        const days = daysElapsed(lead.createdAt);
        const email = lead.email;

        results.processed++;

        // D+3: Send follow-up if 3+ days have passed and not yet sent
        if (days >= 3 && !lead.emailD3Sent) {
          try {
            const result = await sendTemplateEmail(email, "d3");
            if (result.success) {
              await markLeadEmailSent(email, "d3");
              results.d3Sent++;
              console.log(`[Scheduled] ✓ D+3 sent to ${email}`);
            } else {
              results.errors.push(`D+3 failed for ${email}: ${result.error}`);
            }
          } catch (err) {
            results.errors.push(`D+3 error for ${email}: ${String(err)}`);
          }
        }

        // D+5: Send Curiosità IA if 5+ days have passed and not yet sent
        if (days >= 5 && !lead.emailD5Sent) {
          try {
            const result = await sendTemplateEmail(email, "d5");
            if (result.success) {
              await markLeadEmailSent(email, "d5");
              results.d5Sent++;
              console.log(`[Scheduled] ✓ D+5 sent to ${email}`);
            } else {
              results.errors.push(`D+5 failed for ${email}: ${result.error}`);
            }
          } catch (err) {
            results.errors.push(`D+5 error for ${email}: ${String(err)}`);
          }
        }

        // D+10: Send Invito Consulenza + apply tag if 10+ days have passed and not yet sent
        if (days >= 10 && !lead.emailD10Sent) {
          try {
            const result = await sendTemplateEmail(email, "d10");
            if (result.success) {
              await markLeadEmailSent(email, "d10");
              results.d10Sent++;
              console.log(`[Scheduled] ✓ D+10 sent to ${email}`);

              // Apply the STATUS_pronto_consulenza tag
              const tagResult = await applyConsulenzaTag(email);
              if (tagResult.success) {
                await markLeadConsulenzaTagApplied(email);
                results.tagsApplied++;
                console.log(`[Scheduled] ✓ Tag STATUS_pronto_consulenza applied to ${email}`);
              } else {
                results.errors.push(`Tag failed for ${email}: ${tagResult.error}`);
              }
            } else {
              results.errors.push(`D+10 failed for ${email}: ${result.error}`);
            }
          } catch (err) {
            results.errors.push(`D+10 error for ${email}: ${String(err)}`);
          }
        }
      }

      console.log(`[Scheduled] Lead email sequence complete:`, results);
      return res.json({
        success: true,
        ...results,
      });
    } catch (err) {
      console.error("[Scheduled] Lead email sequence error:", err);
      return res.status(500).json({ success: false, error: String(err) });
    }
  });
}
