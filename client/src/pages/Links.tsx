/**
 * Link in Bio — Instagram (@ilconsigliere.io)
 * Fase 1: Objetivo único = capturar leads
 *
 * Diagnóstico aplicado:
 * 1. DELETADO: Link "Mappa IA Checkout" Stripe (contradiz "gratis")
 * 2. DELETADO: "Segui su Instagram" (redundante — visitante veio do IG)
 * 3. ADICIONADO: Foto circular do Lamberto no header
 * 4. CORRIGIDO: Tagline fala do dono de PMI, não de multinacionais
 * 5. CORRIGIDO: Descrição do link 1 com benefício específico (80 processi)
 * 6. CORRIGIDO: "Chi è Lamberto Grinover" (pessoa, não marca)
 */

import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { trackPageView, trackCTAClick } from "@/lib/tracking";

const LAMBERTO_PHOTO = "/manus-storage/lamberto-links-square-v2_c959460c.jpeg";

const BASE_URL = "https://www.ilconsigliere.io";

interface LinkItem {
  label: string;
  description: string;
  href: string;
  utmContent: string;
  primary?: boolean;
}

const LINKS: LinkItem[] = [
  {
    label: "Ricevi la Mappa delle Opportunità IA — Gratis",
    description:
      "80 processi analizzati. In 10 minuti sa da dove iniziare.",
    href: "/lead",
    utmContent: "lead-mappa-gratis",
    primary: true,
  },
  {
    label: "Il Giornale dell'IA — casi pratici per PMI",
    description:
      "Un caso reale ogni settimana. Gratis.",
    href: "/giornale",
    utmContent: "giornale-ia",
  },
  {
    label: "Chi è Lamberto Grinover",
    description:
      "Ex-direttore operativo. Oggi aiuta le PMI italiane a usare l'IA dove conta.",
    href: "/chi-siamo",
    utmContent: "chi-siamo",
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

export default function Links() {
  useEffect(() => {
    trackPageView(window.location.href);
  }, []);

  const handleLinkClick = (link: LinkItem) => {
    trackCTAClick(link.label, "linkinbio");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center">
      <SEOHead
        title="Lamberto Grinover — IA per PMI Italiane"
        description="Ricevi la Mappa delle Opportunità IA gratis. 80 processi analizzati in 8 reparti."
        path="/links"
      />

      {/* Header — FIX #3: foto Lamberto + FIX #4: tagline PMI */}
      <header className="w-full max-w-md mx-auto pt-8 pb-6 px-5 text-center">
        {/* Foto circular */}
        <div className="flex justify-center mb-4">
          <img
            src={LAMBERTO_PHOTO}
            alt="Lamberto Grinover"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#1B2A4A]/10"
            loading="eager"
          />
        </div>

        {/* Nome + cargo */}
        <h1
          className="text-xl font-bold text-[#1B2A4A] tracking-tight leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Lamberto Grinover
        </h1>

        {/* FIX #4: Tagline focada no PMI, não em multinacionais */}
        <p
          className="text-sm text-[#1B2A4A]/70 mt-2 leading-relaxed"
          style={{ fontFamily: "'Source Serif 4', serif" }}
        >
          Aiuto le PMI italiane a usare l'IA dove conta davvero.
        </p>

        {/* Separator */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px flex-1 bg-[#1B2A4A]/10" />
          <span
            className="text-[10px] text-[#1B2A4A]/30 uppercase tracking-wider"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            @ilconsigliere.io
          </span>
          <div className="h-px flex-1 bg-[#1B2A4A]/10" />
        </div>
      </header>

      {/* Links — apenas 3, sem Stripe, sem Instagram */}
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
                  ? "bg-[#C4704B] border-[#C4704B] text-white hover:bg-[#A85A3A] shadow-md"
                  : "bg-white border-[#1B2A4A]/15 text-[#1B2A4A] hover:border-[#1B2A4A]/40 hover:shadow-sm"
              }
            `}
          >
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="flex-1 min-w-0">
                <span
                  className={`block text-sm font-semibold leading-tight ${
                    link.primary ? "text-white" : "text-[#1B2A4A]"
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {link.label}
                </span>
                <span
                  className={`block text-xs mt-1 leading-snug ${
                    link.primary ? "text-white/70" : "text-[#1B2A4A]/50"
                  }`}
                  style={{ fontFamily: "'Source Serif 4', serif" }}
                >
                  {link.description}
                </span>
              </div>
              <svg
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
                  link.primary ? "text-white/60" : "text-[#1B2A4A]/30"
                }`}
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
        ))}
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
