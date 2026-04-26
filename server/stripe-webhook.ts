/**
 * Stripe Webhook Handler — /api/stripe/webhook
 *
 * Handles checkout.session.completed events.
 * Logs purchases and notifies the owner.
 */

import type { Express, Request, Response } from "express";
import Stripe from "stripe";
import { notifyOwner } from "./_core/notification";
import { PRODUCTS } from "./stripe-products";
import { applyMailchimpTag } from "./mailchimp";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key);
}

export function registerStripeWebhook(app: Express) {
  // MUST be registered BEFORE express.json() in the main server file
  app.post(
    "/api/stripe/webhook",
    // Raw body is needed for signature verification
    (req: Request, res: Response) => {
      const stripe = getStripe();
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured");
        return res.status(500).json({ error: "Webhook secret not configured" });
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[Stripe Webhook] Signature verification failed: ${msg}`);
        return res.status(400).json({ error: `Webhook Error: ${msg}` });
      }

      // Handle test events for webhook verification
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

      // Process the event
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          handleCheckoutCompleted(session).catch((err) => {
            console.error("[Stripe Webhook] Error processing checkout:", err);
          });
          break;
        }
        default:
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }

      return res.json({ received: true });
    }
  );
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_details?.email || session.metadata?.customer_email || "unknown";
  const customerName = session.metadata?.customer_name || "unknown";
  const productKey = session.metadata?.product_key || "unknown";
  const includesOrderBump = session.metadata?.includes_order_bump === "true";
  const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00";

  console.log(
    `[Stripe Webhook] ✓ Checkout completed: ${customerEmail}, product=${productKey}, amount=€${amountTotal}, order_bump=${includesOrderBump}`
  );

  // Determine what was purchased
  const items: string[] = [];
  if (productKey === "mappa_opportunita_ia" || productKey === "mappa_with_sessione") {
    items.push(`Mappa delle Opportunità IA (€${(PRODUCTS.mappa.priceEurCents / 100).toFixed(2)})`);
  }
  if (includesOrderBump || productKey === "mappa_with_sessione") {
    items.push(`Sessione Diagnosi IA (€${(PRODUCTS.sessioneDiagnosi.priceEurCents / 100).toFixed(2)})`);
  }

  // Apply Mailchimp tag PROD_mappa_ia_47 for post-purchase automation
  try {
    const tagResult = await applyMailchimpTag(customerEmail, "PROD_mappa_ia_47");
    if (tagResult.success) {
      console.log(`[Stripe Webhook] ✓ Mailchimp tag PROD_mappa_ia_47 applied to ${customerEmail}`);
    } else {
      console.warn(`[Stripe Webhook] ✗ Mailchimp tag failed for ${customerEmail}: ${tagResult.error}`);
    }
  } catch (err) {
    console.error("[Stripe Webhook] ✗ Mailchimp tag error:", err);
  }

  // Notify owner about the purchase
  try {
    await notifyOwner({
      title: `💰 Nuovo Acquisto: ${customerName} — €${amountTotal}`,
      content: [
        `NUOVO ACQUISTO COMPLETATO`,
        ``,
        `Cliente: ${customerName}`,
        `Email: ${customerEmail}`,
        `Totale: €${amountTotal}`,
        ``,
        `Prodotti:`,
        ...items.map((item) => `  • ${item}`),
        ``,
        `Stripe Session: ${session.id}`,
        `Payment Intent: ${session.payment_intent}`,
        `Data: ${new Date().toISOString()}`,
        ``,
        `AZIONE RICHIESTA: Inviare i materiali a ${customerEmail}`,
      ].join("\n"),
    });
    console.log(`[Stripe Webhook] ✓ Owner notified about purchase from ${customerEmail}`);
  } catch (err) {
    console.error("[Stripe Webhook] ✗ Failed to notify owner:", err);
  }
}
