/**
 * Scheduled Email Sequence Endpoint — /api/scheduled/email-sequence
 *
 * Called by a scheduled task (every 6 hours) to process the post-purchase email sequence.
 * Checks all purchases that haven't completed the full sequence and sends emails based on elapsed days:
 * - D+3: Follow-up email
 * - D+5: Curiosità IA email
 * - D+8: Settimana Zero email + apply tag STATUS_pronto_settimana_zero
 *
 * D+0 is sent immediately by the Stripe webhook, not by this endpoint.
 */

import type { Express, Request, Response } from "express";
import { getPendingEmailSequence, markEmailSent, markSettimanaZeroTagApplied } from "./db";
import { sendTemplateEmail, applySettimanaZeroTag } from "./email-sequence";

/** Calculate days elapsed since purchase */
function daysElapsed(purchasedAt: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - purchasedAt.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function registerScheduledEmailSequence(app: Express) {
  app.post("/api/scheduled/email-sequence", async (req: Request, res: Response) => {
    console.log("[Scheduled] Email sequence processor started");

    try {
      const pendingPurchases = await getPendingEmailSequence();
      console.log(`[Scheduled] Found ${pendingPurchases.length} purchases pending email sequence`);

      const results = {
        processed: 0,
        d3Sent: 0,
        d5Sent: 0,
        d8Sent: 0,
        tagsApplied: 0,
        errors: [] as string[],
      };

      for (const purchase of pendingPurchases) {
        const days = daysElapsed(purchase.purchasedAt);
        const email = purchase.email;
        const sessionId = purchase.stripeSessionId;

        results.processed++;

        // D+3: Send follow-up if 3+ days have passed and not yet sent
        if (days >= 3 && !purchase.emailD3Sent) {
          try {
            const result = await sendTemplateEmail(email, "d3");
            if (result.success) {
              await markEmailSent(email, sessionId, "d3");
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
        if (days >= 5 && !purchase.emailD5Sent) {
          try {
            const result = await sendTemplateEmail(email, "d5");
            if (result.success) {
              await markEmailSent(email, sessionId, "d5");
              results.d5Sent++;
              console.log(`[Scheduled] ✓ D+5 sent to ${email}`);
            } else {
              results.errors.push(`D+5 failed for ${email}: ${result.error}`);
            }
          } catch (err) {
            results.errors.push(`D+5 error for ${email}: ${String(err)}`);
          }
        }

        // D+8: Send Settimana Zero + apply tag if 8+ days have passed and not yet sent
        if (days >= 8 && !purchase.emailD8Sent) {
          try {
            const result = await sendTemplateEmail(email, "d8");
            if (result.success) {
              await markEmailSent(email, sessionId, "d8");
              results.d8Sent++;
              console.log(`[Scheduled] ✓ D+8 sent to ${email}`);

              // Apply the STATUS_pronto_settimana_zero tag
              const tagResult = await applySettimanaZeroTag(email);
              if (tagResult.success) {
                await markSettimanaZeroTagApplied(email, sessionId);
                results.tagsApplied++;
                console.log(`[Scheduled] ✓ Tag STATUS_pronto_settimana_zero applied to ${email}`);
              } else {
                results.errors.push(`Tag failed for ${email}: ${tagResult.error}`);
              }
            } else {
              results.errors.push(`D+8 failed for ${email}: ${result.error}`);
            }
          } catch (err) {
            results.errors.push(`D+8 error for ${email}: ${String(err)}`);
          }
        }
      }

      console.log(`[Scheduled] Email sequence complete:`, results);
      return res.json({
        success: true,
        ...results,
      });
    } catch (err) {
      console.error("[Scheduled] Email sequence error:", err);
      return res.status(500).json({ success: false, error: String(err) });
    }
  });
}
