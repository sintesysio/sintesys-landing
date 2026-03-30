/**
 * Link in Bio — Instagram (@sintesys.io)
 * Pagina di menu per il link nella bio di Instagram
 * Stile editoriale "Il Giornale dell'IA" — coerente con il brand
 * Tutti i link con UTM tracking completo per GA4
 * Mobile-first (100% traffico da Instagram mobile)
 */

import { useEffect } from "react";
import { trackPageView, trackCTAClick } from "@/lib/tracking";

const BRAIN_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/brain-icon_a74d4c28.png";

const BASE_URL = "https://sintesysio.io";

interface LinkItem {
  label: string;
  description: string;
  href: string;
  utmContent: string;
  icon: string;
  primary?: boolean;
}

const LINKS: LinkItem[] = [
  {
    label: "Prenota la Sessione Strategica",
    description: "30 min con Lamberto Grinover — Analisi IA per la tua PMI",
    href: "/",
    utmContent: "sessione-strategica",
    icon: "📋",
    primary: true,
  },
  {
    label: "Il Giornale dell'IA",
    description: "Edizione quotidiana — Strategie IA per imprenditori italiani",
    href: "/giornale",
    utmContent: "giornale-ia",
    icon: "📰",
  },
  {
    label: "Chi è Sintesys.io",
    description: "La nostra missione e il metodo dei 90 giorni",
    href: "/chi-siamo",
    utmContent: "chi-siamo",
    icon: "🏛️",
  },
  {
    label: "Contattaci",
    description: "Richiedi un audit personalizzato per la tua azienda",
    href: "/contattaci",
    utmContent: "contattaci",
    icon: "✉️",
  },
];

function buildUtmUrl(path: string, utmContent: string): string {
  const url = new URL(path, BASE_URL);
  url.searchParams.set("utm_source", "ig");
  url.searchParams.set("utm_medium", "linkinbio");
  url.searchParams.set("utm_campaign", "bio-sintesys");
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
  useEffect(() => {
    trackPageView(window.location.href);
  }, []);

  const handleLinkClick = (link: LinkItem) => {
    trackCTAClick(link.label, "linkinbio");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center">
      {/* Masthead */}
      <header className="w-full max-w-md mx-auto pt-8 pb-4 px-5 text-center">
        {/* Decorative top line */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px flex-1 bg-[#1B2A4A]/20" />
          <img
            src={BRAIN_ICON}
            alt="Sintesys.io"
            className="w-10 h-10"
          />
          <div className="h-px flex-1 bg-[#1B2A4A]/20" />
        </div>

        {/* Newspaper title */}
        <h1
          className="text-2xl font-bold text-[#1B2A4A] tracking-tight leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Il Giornale dell'IA
        </h1>
        <p
          className="text-xs text-[#1B2A4A]/50 mt-1 uppercase tracking-[0.2em]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Sintesys.io
        </p>

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
          Strategie operative di Intelligenza Artificiale
          <br />
          per titolari di PMI italiane
        </p>
      </header>

      {/* Links */}
      <main className="w-full max-w-md mx-auto px-5 pb-8 flex flex-col gap-3">
        {LINKS.map((link) => (
          <a
            key={link.utmContent}
            href={buildUtmUrl(link.href, link.utmContent)}
            onClick={() => handleLinkClick(link)}
            className={`
              group block w-full rounded-lg border transition-all duration-200
              ${
                link.primary
                  ? "bg-[#1B2A4A] border-[#1B2A4A] text-white hover:bg-[#243660] shadow-md"
                  : "bg-white border-[#1B2A4A]/15 text-[#1B2A4A] hover:border-[#1B2A4A]/40 hover:shadow-sm"
              }
            `}
          >
            <div className="flex items-center gap-3 px-4 py-4">
              {/* Icon */}
              <span className="text-xl flex-shrink-0" role="img" aria-hidden="true">
                {link.icon}
              </span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <span
                  className={`
                    block text-sm font-semibold leading-tight
                    ${link.primary ? "text-white" : "text-[#1B2A4A]"}
                  `}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {link.label}
                </span>
                <span
                  className={`
                    block text-xs mt-0.5 leading-snug
                    ${link.primary ? "text-white/70" : "text-[#1B2A4A]/50"}
                  `}
                  style={{ fontFamily: "'Source Serif 4', serif" }}
                >
                  {link.description}
                </span>
              </div>

              {/* Arrow */}
              <svg
                className={`
                  w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5
                  ${link.primary ? "text-white/60" : "text-[#1B2A4A]/30"}
                `}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}

        {/* Instagram follow */}
        <a
          href="https://www.instagram.com/sintesys.io/"
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
            @sintesys.io
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
          &copy; {new Date().getFullYear()} Sintesys.io — Tutti i diritti riservati
        </p>
      </footer>
    </div>
  );
}
