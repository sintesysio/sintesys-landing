/**
 * Tracking Helper — GA4 + Meta Pixel
 *
 * Centraliza todos os eventos de conversão.
 * Funções são no-op se os scripts não estiverem carregados (IDs não configurados).
 *
 * Uso:
 *   import { trackLeadSimple, trackLeadQualified, trackFormView, trackConversion } from '@/lib/tracking';
 *   trackLeadSimple({ name, email, sector });
 */

// ─── Type declarations for global tracking functions ───
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// ─── Helpers ───

function ga4Event(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

function metaPixelEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }
}

function metaPixelCustomEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", eventName, params);
  }
}

// ─── Page View (já disparado automaticamente pelo script no index.html) ───

export function trackPageView(url?: string) {
  ga4Event("page_view", { page_location: url || window.location.href });
  // Meta Pixel PageView já é disparado automaticamente no index.html
}

// ─── Formulário Aberto (popup modal abriu) ───

export function trackFormView(formName: string) {
  ga4Event("view_item", {
    item_name: formName,
    content_type: "form",
  });
  metaPixelEvent("ViewContent", {
    content_name: formName,
    content_category: "form",
  });
}

// ─── Lead Simples (popup do Giornale / lead magnet) ───

export function trackLeadSimple(params: {
  name: string;
  email: string;
  sector?: string;
  source: string;
}) {
  ga4Event("generate_lead", {
    currency: "EUR",
    value: 1,
    lead_type: "simple",
    lead_source: params.source,
    lead_sector: params.sector || "Non specificato",
  });
  metaPixelEvent("Lead", {
    content_name: "Lead Simples",
    content_category: params.sector || "Non specificato",
    lead_source: params.source,
  });
}

// ─── Lead Qualificado (Landing Page popup / Contattaci) ───

export function trackLeadQualified(params: {
  name: string;
  email: string;
  sector?: string;
  source: "landing_page" | "contattaci";
  revenue?: string;
  employees?: string;
}) {
  ga4Event("generate_lead", {
    currency: "EUR",
    value: 10,
    lead_type: "qualified",
    lead_source: params.source,
    lead_sector: params.sector || "Non specificato",
    lead_revenue: params.revenue,
    lead_employees: params.employees,
  });
  metaPixelEvent("CompleteRegistration", {
    content_name: "Lead Qualificato",
    content_category: params.sector || "Non specificato",
    status: "qualified",
    value: 10,
    currency: "EUR",
  });
}

// ─── Conversão na Thank You Page ───

export function trackConversion(params?: {
  source?: string;
  sector?: string;
}) {
  ga4Event("conversion", {
    send_to: "default",
    event_category: "lead",
    event_label: params?.source || "thank_you_page",
    value: 10,
    currency: "EUR",
  });
  metaPixelEvent("Schedule", {
    content_name: "Sessione Strategica Prenotata",
    content_category: params?.sector || "general",
  });
}

// ─── Evento customizado genérico ───

export function trackCustomEvent(eventName: string, params?: Record<string, unknown>) {
  ga4Event(eventName, params);
  metaPixelCustomEvent(eventName, params);
}

// ─── CTA Click (botão CTA clicado) ───

export function trackCTAClick(ctaName: string, location: string) {
  ga4Event("cta_click", {
    cta_name: ctaName,
    cta_location: location,
  });
  metaPixelCustomEvent("CTAClick", {
    cta_name: ctaName,
    cta_location: location,
  });
}

// ─── Initiate Checkout (quando clica no CTA de compra) ───

export function trackInitiateCheckout(params: {
  productName: string;
  value: number;
  currency?: string;
  includesOrderBump?: boolean;
}) {
  ga4Event("begin_checkout", {
    currency: params.currency || "EUR",
    value: params.value,
    items: [{ item_name: params.productName }],
    includes_order_bump: params.includesOrderBump || false,
  });
  metaPixelEvent("InitiateCheckout", {
    content_name: params.productName,
    value: params.value,
    currency: params.currency || "EUR",
    num_items: params.includesOrderBump ? 2 : 1,
  });
}

// ─── Purchase Completed (após checkout Stripe bem-sucedido) ───

export function trackPurchase(params: {
  transactionId: string;
  value: number;
  currency?: string;
  productName: string;
  includesOrderBump?: boolean;
}) {
  ga4Event("purchase", {
    transaction_id: params.transactionId,
    currency: params.currency || "EUR",
    value: params.value,
    items: [{ item_name: params.productName }],
    includes_order_bump: params.includesOrderBump || false,
  });
  metaPixelEvent("Purchase", {
    content_name: params.productName,
    content_type: "product",
    value: params.value,
    currency: params.currency || "EUR",
    num_items: params.includesOrderBump ? 2 : 1,
  });
}

// ─── Scroll Depth (para medir engajamento) ───

export function trackScrollDepth(percentage: number) {
  ga4Event("scroll", {
    percent_scrolled: percentage,
  });
}
