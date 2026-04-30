/**
 * Stripe Checkout Session — /api/stripe/create-checkout
 *
 * Creates a Stripe Checkout Session for the Mappa product.
 * Supports optional order bump (Sessione Diagnosi IA).
 * Returns the checkout URL for frontend redirect.
 *
 * This is a public endpoint — no auth required (product is for anonymous visitors).
 */

import type { Express, Request, Response } from "express";
import Stripe from "stripe";
import { PRODUCTS } from "./stripe-products";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key);
}

export function registerStripeCheckout(app: Express) {
  app.post("/api/stripe/create-checkout", async (req: Request, res: Response) => {
    try {
      const stripe = getStripe();
      const { includeOrderBump = false, customerEmail, customerName } = req.body as {
        includeOrderBump?: boolean;
        customerEmail?: string;
        customerName?: string;
      };

      const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, "") || "https://www.ilconsigliere.io";

      // Build line items
      const lineItems = [
        {
          price_data: {
            currency: PRODUCTS.mappa.currency as string,
            product_data: {
              name: PRODUCTS.mappa.name as string,
              description: PRODUCTS.mappa.description as string,
            },
            unit_amount: PRODUCTS.mappa.priceEurCents as number,
          },
          quantity: 1,
        },
      ];

      // Add order bump if selected
      if (includeOrderBump) {
        lineItems.push({
          price_data: {
            currency: PRODUCTS.sessioneDiagnosi.currency as string,
            product_data: {
              name: PRODUCTS.sessioneDiagnosi.name as string,
              description: PRODUCTS.sessioneDiagnosi.description as string,
            },
            unit_amount: PRODUCTS.sessioneDiagnosi.bumpPriceEurCents as number,
          },
          quantity: 1,
        });
      }

      const productKey = includeOrderBump ? "mappa_with_sessione" : "mappa_opportunita_ia";

      // Create checkout session — using stripe SDK's inferred types
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        success_url: `${origin}/mappa/grazie?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/mappa`,
        allow_promotion_codes: true,
        metadata: {
          product_key: productKey,
          includes_order_bump: includeOrderBump ? "true" : "false",
          customer_name: customerName || "",
          customer_email: customerEmail || "",
        },
        billing_address_collection: "required",
        custom_fields: [
          {
            key: "partita_iva",
            label: { type: "custom", custom: "Partita IVA (opzionale)" },
            type: "text",
            optional: true,
          },
        ],
        locale: "it",
        ...(customerEmail ? { customer_email: customerEmail } : {}),
      });

      console.log(
        `[Stripe Checkout] ✓ Session created: ${session.id}, product=${productKey}, order_bump=${includeOrderBump}`
      );

      return res.json({
        url: session.url,
        sessionId: session.id,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Stripe Checkout] ✗ Failed to create session: ${msg}`);
      return res.status(500).json({ error: "Failed to create checkout session" });
    }
  });
}
