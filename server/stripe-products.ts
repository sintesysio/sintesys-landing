/**
 * Stripe Products & Prices — Il Consigliere
 *
 * Centralized product definitions for Stripe Checkout.
 * Products are created on-the-fly using Stripe's inline price_data
 * so no manual Product/Price creation in the Dashboard is needed.
 *
 * Pricing aggiornato (08-Aggiornamento-Sito-LP):
 *   Mappa: €129,90 regolare → €49,50 lancio
 *   Sessione: €247 regolare → €197 standalone → €147 bump (con Mappa)
 */

export const PRODUCTS = {
  mappa: {
    name: "Mappa delle Opportunità IA",
    description:
      "Foglio Excel professionale con 80 processi pre-mappati su 8 reparti + 5 documenti Word di accompagnamento. Ora inclusa gratuitamente per gli iscritti alla newsletter.",
    priceEurCents: 0, // Gratuita per iscritti (era €49,50)
    regularPriceEurCents: 12990, // €129,90 — prezzo regolare (compare-at)
    currency: "eur",
    metadata: {
      product_key: "mappa_opportunita_ia",
      type: "free_lead_magnet",
    },
  },
  masterclass: {
    name: "Masterclass Il Consigliere",
    description:
      "Sessione live di 90 minuti con Lamberto Grinover. Diagnosi della sua azienda, piano d'azione concreto, domande reali. Una volta al mese, max 15 partecipanti.",
    priceEurCents: 9700, // €97,00
    currency: "eur",
    metadata: {
      product_key: "masterclass_il_consigliere",
      type: "mid_ticket",
    },
  },
  sessioneDiagnosi: {
    name: "Sessione Diagnosi IA con Lamberto Grinover",
    description:
      "90 minuti in diretta con Lamberto. Analisi personalizzata dei tuoi processi + roadmap priorità IA. Gruppo ristretto, una volta al mese.",
    priceEurCents: 19700, // €197,00 — prezzo standalone lancio (regolare €247)
    bumpPriceEurCents: 14700, // €147,00 — prezzo bump con Mappa (sconto €100 vs regolare)
    regularPriceEurCents: 24700, // €247,00 — prezzo regolare
    currency: "eur",
    metadata: {
      product_key: "sessione_diagnosi_ia",
      type: "order_bump",
    },
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
