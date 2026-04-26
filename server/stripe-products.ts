/**
 * Stripe Products & Prices — Sintesys.io
 *
 * Centralized product definitions for Stripe Checkout.
 * Products are created on-the-fly using Stripe's inline price_data
 * so no manual Product/Price creation in the Dashboard is needed.
 */

export const PRODUCTS = {
  mappa: {
    name: "Mappa delle Opportunità IA",
    description:
      "Foglio Excel professionale con 80 processi pre-mappati su 8 reparti + 5 documenti Word di accompagnamento. Consegna immediata via email.",
    priceEurCents: 4700, // €47.00
    currency: "eur",
    metadata: {
      product_key: "mappa_opportunita_ia",
      type: "low_ticket",
    },
  },
  sessioneDiagnosi: {
    name: "Sessione Diagnosi IA con Lamberto Grinover",
    description:
      "90 minuti in diretta con Lamberto. Analisi personalizzata dei tuoi processi + roadmap priorità IA. Sconto esclusivo per chi ha la Mappa.",
    priceEurCents: 9700, // €97.00
    currency: "eur",
    metadata: {
      product_key: "sessione_diagnosi_ia",
      type: "order_bump",
    },
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
