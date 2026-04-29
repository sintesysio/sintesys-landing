/**
 * Thank You Page — Mappa delle Opportunità IA
 * Shown after successful Stripe checkout.
 * Fires GA4 purchase event + Meta Pixel Purchase.
 */

import { useEffect, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { trackPurchase } from "@/lib/tracking";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";

export default function MappaGraziePage() {
  // Extract session_id from URL params
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const sessionId = searchParams.get("session_id") || "";

  useEffect(() => {
    // Fire purchase tracking event once
    if (sessionId) {
      trackPurchase({
        transactionId: sessionId,
        value: 95.50,
        currency: "EUR",
        productName: "Mappa delle Opportunità IA",
        includesOrderBump: false,
      });
    }
  }, [sessionId]);

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      <SEOHead
        title="Grazie — La sua Mappa è in arrivo | Il Consigliere"
        description="Confermato. Riceverà i 6 file via email entro 2 minuti."
        path="/mappa/grazie"
        noindex
      />
      
      {/* Header */}
      <header
        style={{
          backgroundColor: "#1B2A4A",
          borderBottom: "3px double rgba(196,112,75,0.5)",
        }}
      >
        <div className="container py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={LOGO_ICON} alt="Il Consigliere" className="w-7 h-7" />
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#FAFAF7",
                  letterSpacing: "0.04em",
                }}
              >
                Il Consigliere
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-16 lg:py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div
            className="mx-auto mb-8 flex items-center justify-center"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "rgba(27,42,74,0.08)",
              border: "2px solid #1B2A4A",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1B2A4A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            Grazie per il suo acquisto.
          </h1>

          <p
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.15rem",
              color: "#3A3A3A",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            Riceverà i 6 file via email entro 2 minuti.
          </p>

          {/* What to expect */}
          <div
            className="text-left p-8 mb-8"
            style={{
              backgroundColor: "rgba(27,42,74,0.04)",
              border: "1px solid rgba(27,42,74,0.12)",
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#1B2A4A",
                marginBottom: "1rem",
              }}
            >
              Cosa succede adesso?
            </h2>
            <ol
              className="space-y-3"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1rem",
                color: "#3A3A3A",
                lineHeight: 1.6,
                paddingLeft: "1.5rem",
              }}
            >
              <li>
                <strong>Controlli la Sua email</strong> — riceverai i materiali
                all'indirizzo utilizzato per il pagamento.
              </li>
              <li>
                <strong>Scarichi il foglio Excel</strong> — lo apra e inizi a
                esplorare gli 80 processi mappati su 8 reparti.
              </li>
              <li>
                <strong>Leggi le 5 guide Word</strong> — ti accompagnano
                passo-passo nell'analisi e nella prioritizzazione.
              </li>
              <li>
                <strong>Agisci entro 48 ore</strong> — il momento migliore per
                iniziare è adesso.
              </li>
            </ol>
          </div>



          {/* ═══════════════════════════════════════════════════════ */}
          {/* NEWSLETTER INVITE                                       */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div
            className="text-center p-6 mb-8"
            style={{
              backgroundColor: "rgba(27,42,74,0.04)",
              border: "1px solid rgba(27,42,74,0.12)",
            }}
          >
            <p
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1rem",
                color: "#3A3A3A",
                lineHeight: 1.7,
                marginBottom: "0.75rem",
              }}
            >
              Iscritto al Giornale dell'IA? Riceva ogni settimana strategie operative aggiuntive — gratis.
            </p>
            <Link href="/">
              <span
                className="inline-block cursor-pointer px-5 py-2.5 text-xs uppercase tracking-[0.15em]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  backgroundColor: "#1B2A4A",
                  color: "#FAFAF7",
                }}
              >                Sì, mi iscrivo →\u2192
              </span>
            </Link>
          </div>

          {/* Support note */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              color: "#777",
              lineHeight: 1.6,
            }}
          >
            Problemi con la consegna? Scrivi a{" "}
            <a
              href="mailto:lamberto@grinoverconsulenza.it"
              style={{ color: "#1B2A4A", textDecoration: "underline" }}
            >
              lamberto@grinoverconsulenza.it
            </a>{" "}
            e ti risponderemo entro 24 ore.
          </p>

          {/* Back to home */}
          <div className="mt-10">
            <Link href="/">
              <span
                className="inline-block cursor-pointer"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#1B2A4A",
                  borderBottom: "1px solid #1B2A4A",
                  paddingBottom: "2px",
                }}
              >
                \u2190 Torna alla homepage
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#1B2A4A",
          borderTop: "3px double rgba(196,112,75,0.5)",
        }}
      >
        <div className="container py-6 text-center">
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "rgba(250,250,247,0.5)",
            }}
          >
            © {new Date().getFullYear()} Il Consigliere — Tutti i diritti riservati
          </p>
        </div>
      </footer>
    </div>
  );
}
