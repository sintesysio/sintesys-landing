/**
 * Server-Side SEO Middleware
 * 
 * Injects unique meta tags (title, description, OG, Twitter Card) into the HTML
 * template BEFORE sending it to the browser. This ensures that:
 * - Google crawlers see unique meta per page (even without JS execution)
 * - WhatsApp/LinkedIn/email previews show correct page-specific info
 * - Meta Pixel and GA4 see correct page context
 * 
 * This is a lightweight alternative to full SSR (Next.js) that solves the
 * critical SEO/social-sharing issues identified in the audit.
 */

interface PageMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical: string;
  noindex?: boolean;
}

const BASE_URL = "https://ilconsigliere.io";
const DEFAULT_OG_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/hero-newspaper-X6Nu9ZvEg3XFvxCoNGtAqn.webp";

const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "Il Consigliere — Intelligenza Artificiale operativa per PMI italiane",
    description: "Riduca il caos operativo della Sua PMI. Newsletter settimanale gratuita + Guida Transizione 5.0 in omaggio.",
    canonical: `${BASE_URL}/`,
  },
  "/giornale": {
    title: "Il Giornale dell'IA — Newsletter settimanale per imprenditori italiani",
    description: "Ogni settimana, analisi e strategie IA concrete per PMI con 10-50 dipendenti. Gratuita. Niente gergo.",
    canonical: `${BASE_URL}/giornale`,
  },
  "/mappa": {
    title: "Mappa delle Opportunità IA — Diagnostico per la Sua PMI · €95,50",
    description: "In 30 minuti, scopra dove l'IA può liberare ore della Sua settimana. 80 processi pre-mappati, 8 reparti, garanzia 14 giorni.",
    canonical: `${BASE_URL}/mappa`,
  },
  "/mappa/grazie": {
    title: "Grazie — La sua Mappa è in arrivo | Il Consigliere",
    description: "Confermato. Riceverà i 6 file via email entro 2 minuti.",
    canonical: `${BASE_URL}/mappa/grazie`,
    noindex: true,
  },
  "/chi-siamo": {
    title: "Chi è Il Consigliere — 28 anni di operations in multinazionali",
    description: "Fondata da Lamberto Grinover. Da Nissan, Cushman & Wakefield, Tishman Speyer e Brookfield alle PMI italiane.",
    canonical: `${BASE_URL}/chi-siamo`,
  },
  "/contattaci": {
    title: "Contatti & Conversazione Strategica — Il Consigliere",
    description: "Compili il questionario per parlare con Lamberto Grinover. Risposta entro 24h.",
    canonical: `${BASE_URL}/contattaci`,
  },
  "/links": {
    title: "Il Consigliere — Link | Tutti i nostri canali",
    description: "Tutti i contenuti, prodotti e modi per entrare in contatto con Il Consigliere.",
    canonical: `${BASE_URL}/links`,
  },
  "/grazie": {
    title: "Grazie — Iscrizione confermata | Il Consigliere",
    description: "Riceverà la Guida Transizione 5.0 entro pochi minuti. Controlli anche lo spam.",
    canonical: `${BASE_URL}/grazie`,
    noindex: true,
  },
};

/**
 * Injects page-specific meta tags into the HTML template.
 * Called from the server's catch-all route before sending HTML to the client.
 */
export function injectPageMeta(html: string, urlPath: string): string {
  // Normalize path: remove trailing slash, query string, hash
  let normalizedPath = urlPath.split("?")[0].split("#")[0];
  if (normalizedPath !== "/" && normalizedPath.endsWith("/")) {
    normalizedPath = normalizedPath.slice(0, -1);
  }

  const meta = PAGE_META[normalizedPath];
  if (!meta) return html;

  const ogTitle = meta.ogTitle || meta.title;
  const ogDescription = meta.ogDescription || meta.description;
  const ogImage = meta.ogImage || DEFAULT_OG_IMAGE;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${meta.title}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${meta.description}" />`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${meta.canonical}" />`
  );

  // Replace OG tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${ogTitle}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${ogDescription}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${meta.canonical}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${ogImage}" />`
  );

  // Replace Twitter Card tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${ogTitle}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${ogDescription}" />`
  );

  // Add noindex if needed
  if (meta.noindex) {
    html = html.replace(
      /<meta name="robots" content="[^"]*"\s*\/?>/,
      `<meta name="robots" content="noindex, nofollow" />`
    );
  }

  return html;
}
