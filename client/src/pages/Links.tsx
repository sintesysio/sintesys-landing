/**
 * Link in Bio — Instagram (@ilconsigliere.io)
 * Pagina di menu per il link nella bio di Instagram
 * Stile editoriale "Il Giornale dell'IA" — coerente con il brand
 * Tutti i link con UTM tracking completo per GA4
 * Mobile-first (100% traffico da Instagram mobile)
 *
 * Sezioni:
 * 1. Mappa delle Opportunità IA → Checkout Stripe (vendita diretta €95,50)
 * 2. Il Giornale dell'IA → Newsletter (cattura lead)
 * 3. Sito Istituzionale → Newsletter (cattura lead)
 * 4. Chi è Il Consigliere → Pagina Chi Siamo
 */

import { useEffect, useState, useCallback } from "react";
import SEOHead from "@/components/SEOHead";
import { trackPageView, trackCTAClick } from "@/lib/tracking";

const LOGO_ICON =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/PabMcZkaHOkqxPeO.png";

const BASE_URL = "https://ilconsigliere.io";

interface LinkItem {
  label: string;
  description: string;
  href: string;
  utmContent: string;
  primary?: boolean;
  originalPrice?: string;
  launchPrice?: string;
  action: "stripe" | "link";
}

const LINKS: LinkItem[] = [
  {
    label: "Newsletter Gratuita + Guida Transizione 5.0",
    description:
      "Si iscriva e riceva subito la guida. Ogni settimana, strategie IA concrete per la Sua PMI.",
    href: "/",
    utmContent: "newsletter-guida",
    primary: true,
    action: "link",
  },
  {
    label: "Mappa delle Opportunit\u00e0 IA",
    originalPrice: "\u20ac179,90",
    launchPrice: "\u20ac95,50",
    description:
      "80 processi analizzati, 8 reparti mappati, dashboard automatica. Prezzo di lancio.",
    href: "/mappa",
    utmContent: "mappa-ia",
    action: "stripe",
  },
  {
    label: "Il Giornale dell'IA",
    description:
      "Archivio editoriale: analisi settimanali, casi studio e strategie operative per PMI italiane.",
    href: "/giornale",
    utmContent: "giornale-ia",
    action: "link",
  },
  {
    label: "Chi \u00e8 Il Consigliere",
    description:
      "Lamberto Grinover: 28 anni in multinazionali, oggi al servizio della Sua PMI.",
    href: "/chi-siamo",
    utmContent: "chi-siamo",
    action: "link",
  },
  {
    label: "Parli con Lamberto",
    description:
      "Conversazione strategica gratuita. Scopriamo insieme dove l'IA pu\u00f2 migliorare la sua azienda.",
    href: "/contattaci",
    utmContent: "parli-con-lamberto",
    action: "link",
  },
];

function buildUtmUrl(path: string, utmContent: string): string {
  const url = new URL(path, BASE_URL);
  url.searchParams.set("utm_source", "ig");
  url.searchParams.set("utm_medium", "linkinbio");
  url.searchParams.set("utm_campaign", "bio-ilconsigliere");
  url.searchParams.set("utm_content", utmContent);
  url.searchParams.set("utm_term", "bio-link");
  return url.toString();
}

function getTodayItalian(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formatted = now.toLocaleDateString("it-IT", options);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export default function Links() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    trackPageView(window.location.href);
  }, []);

  const handleStripeCheckout = useCallback(async () => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    trackCTAClick("Mappa IA Checkout", "linkinbio");

    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "mappa_opportunita_ia" }),
      });
      if (!res.ok) throw new Error("Errore nella creazione del checkout");
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch {
      // Fallback: redirect to the Mappa landing page
      window.location.href = buildUtmUrl("/mappa", "mappa-ia");
    } finally {
      setCheckoutLoading(false);
    }
  }, [checkoutLoading]);

  const handleLinkClick = (link: LinkItem) => {
    trackCTAClick(link.label, "linkinbio");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center">
      <SEOHead
        title="Il Consigliere — Link | Tutti i nostri canali"
        description="Tutti i contenuti, prodotti e modi per entrare in contatto con Il Consigliere."
        path="/links"
      />
      
      {/* Masthead */}
      <header className="w-full max-w-md mx-auto pt-8 pb-4 px-5 text-center">
        {/* Decorative top line */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px flex-1 bg-[#1B2A4A]/20" />
          <img
            src={LOGO_ICON}
            alt="Il Consigliere"
            className="w-10 h-10"
          />
          <div className="h-px flex-1 bg-[#1B2A4A]/20" />
        </div>

        {/* Brand title */}
        <h1
          className="text-2xl font-bold text-[#1B2A4A] tracking-tight leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Il Consigliere
        </h1>

        {/* Date line — newspaper style */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px flex-1 bg-[#1B2A4A]/10" />
          <span
            className="text-[10px] text-[#1B2A4A]/40 uppercase tracking-wider whitespace-nowrap"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {getTodayItalian()}
          </span>
          <div className="h-px flex-1 bg-[#1B2A4A]/10" />
        </div>

        {/* Tagline */}
        <p
          className="text-sm text-[#1B2A4A]/70 mt-3 leading-relaxed"
          style={{ fontFamily: "'Source Serif 4', serif" }}
        >
          L'IA che le multinazionali usano.
          <br />
          Adattata per la Sua PMI.
        </p>
      </header>

      {/* Links */}
      <main className="w-full max-w-md mx-auto px-5 pb-8 flex flex-col gap-3">
        {LINKS.map((link) =>
          link.action === "stripe" ? (
            /* Mappa IA — Stripe Checkout (vendita diretta) */
            <button
              key={link.utmContent}
              onClick={handleStripeCheckout}
              disabled={checkoutLoading}
              className={`
                group block w-full rounded-lg border transition-all duration-200 text-left cursor-pointer
                bg-[#C4704B] border-[#C4704B] text-white hover:bg-[#A85A3A] shadow-md
                disabled:opacity-60 disabled:cursor-wait
              `}
            >
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="flex-1 min-w-0">
                  <span
                    className="block text-sm font-semibold leading-tight text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {checkoutLoading ? "Caricamento..." : (
                      <>
                        {link.label}{" "}
                        {link.originalPrice && (
                          <span className="line-through opacity-60 text-xs font-normal">{link.originalPrice}</span>
                        )}
                        {" "}
                        {link.launchPrice && (
                          <span className="text-white font-bold">{link.launchPrice}</span>
                        )}
                      </>
                    )}
                  </span>
                  <span
                    className="block text-xs mt-1 leading-snug text-white/70"
                    style={{ fontFamily: "'Source Serif 4', serif" }}
                  >
                    {link.description}
                  </span>
                </div>
                <svg
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ) : (
            /* Links regulares */
            <a
              key={link.utmContent}
              href={buildUtmUrl(link.href, link.utmContent)}
              onClick={() => handleLinkClick(link)}
              className="
                group block w-full rounded-lg border transition-all duration-200
                bg-white border-[#1B2A4A]/15 text-[#1B2A4A] hover:border-[#1B2A4A]/40 hover:shadow-sm
              "
            >
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="flex-1 min-w-0">
                  <span
                    className="block text-sm font-semibold leading-tight text-[#1B2A4A]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {link.label}
                  </span>
                  <span
                    className="block text-xs mt-1 leading-snug text-[#1B2A4A]/50"
                    style={{ fontFamily: "'Source Serif 4', serif" }}
                  >
                    {link.description}
                  </span>
                </div>
                <svg
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 text-[#1B2A4A]/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </a>
          )
        )}

        {/* Instagram follow */}
        <a
          href="https://www.instagram.com/ilconsigliere.io/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCTAClick("Segui su Instagram", "linkinbio")}
          className="
            group flex items-center justify-center gap-2 w-full rounded-lg border
            border-[#1B2A4A]/10 bg-[#FAFAF7] text-[#1B2A4A]/60
            hover:border-[#1B2A4A]/30 hover:text-[#1B2A4A]/80
            transition-all duration-200 py-3 mt-1
          "
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            @ilconsigliere.io
          </span>
        </a>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto px-5 pb-8 text-center">
        <div className="h-px bg-[#1B2A4A]/10 mb-4" />
        <p
          className="text-[10px] text-[#1B2A4A]/30 uppercase tracking-wider"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Consulenza Strategica IA per PMI Italiane
        </p>
        <p
          className="text-[10px] text-[#1B2A4A]/20 mt-1"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          &copy; {new Date().getFullYear()} Il Consigliere — Tutti i diritti
          riservati
        </p>
      </footer>
    </div>
  );
}
