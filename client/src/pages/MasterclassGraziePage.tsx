/**
 * Masterclass Thank You Page — /masterclass/grazie
 * Shown after successful Masterclass purchase
 * Fires Purchase pixel event
 */

import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { trackConversion } from "@/lib/tracking";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";

export default function MasterclassGraziePage() {
  useEffect(() => {
    trackConversion({ source: "masterclass_purchase" });
    // Fire Meta Pixel Purchase event
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase", {
        value: 97,
        currency: "EUR",
        content_name: "Masterclass Il Consigliere",
      });
    }
  }, []);

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      <SEOHead
        title="Perfetto — Il suo posto è confermato | Il Consigliere"
        description="Riceverà il link Zoom all'email indicata 24 ore prima della sessione."
        path="/masterclass/grazie"
        noindex
      />

      {/* Navbar minimal */}
      <nav className="container" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="rule-thick mt-0" />
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <img src={LOGO_ICON} alt="Il Consigliere" className="h-8 w-8 rounded-full" loading="eager" />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Il Consigliere
            </span>
          </Link>
        </div>
        <div className="rule-thin" />
      </nav>

      {/* Content */}
      <section className="container py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success icon */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ backgroundColor: "rgba(196,112,75,0.1)" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C4704B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1
            className="mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#1A1A1A",
              lineHeight: 1.1,
            }}
          >
            Perfetto. Il suo posto è confermato.
          </h1>

          <p
            className="mb-8"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.15rem",
              color: "#444",
              lineHeight: 1.7,
            }}
          >
            Riceverà il link Zoom all'email indicata <strong>24 ore prima della sessione</strong>. 
            Segni la data in agenda — questa è una sessione che richiede la sua presenza attiva.
          </p>

          {/* Steps */}
          <div
            className="p-6 lg:p-8 mb-8 text-left"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e5e5e5",
            }}
          >
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Come prepararsi alla Masterclass
            </h2>
            <div className="space-y-5">
              {[
                {
                  step: "1",
                  title: "Compili la Mappa delle Opportunità IA",
                  desc: "Se non l'ha ancora fatto, la riceve gratuitamente iscrivendosi alla newsletter. Compilarla prima della sessione le permette di arrivare con domande specifiche sulla sua azienda.",
                },
                {
                  step: "2",
                  title: "Prepari 2-3 domande concrete",
                  desc: "Non domande generiche sull'IA. Domande sulla SUA azienda: dove perde tempo, dove i margini si erodono, dove i processi si bloccano. Più specifiche sono, più valore riceve.",
                },
                {
                  step: "3",
                  title: "Si presenti puntuale",
                  desc: "La sessione inizia alle 18:00 CET. Il link Zoom arriva 24 ore prima. Non c'è registrazione — chi c'è, c'è. Chi non c'è, perde l'opportunità.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span
                    className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "#FAFAF7",
                      backgroundColor: "#C4704B",
                    }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#1A1A1A",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "0.9rem",
                        color: "#666",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA to Giornale */}
          <div
            className="p-6"
            style={{
              backgroundColor: "rgba(27,42,74,0.04)",
              border: "1px solid rgba(27,42,74,0.1)",
            }}
          >
            <p
              className="mb-3"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1rem",
                color: "#444",
                lineHeight: 1.6,
              }}
            >
              Mentre aspetta la sessione, legga <strong>Il Giornale dell'IA</strong> — ogni giorno una nuova analisi operativa per la sua PMI.
            </p>
            <Link
              href="/giornale"
              className="inline-block no-underline px-6 py-2.5"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FAFAF7",
                backgroundColor: "#1B2A4A",
              }}
            >
              Leggi Il Giornale dell'IA
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer minimal */}
      <footer className="container pb-8">
        <div className="rule-thin mb-6" />
        <p
          className="text-center"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            color: "#999",
          }}
        >
          © {new Date().getFullYear()} Il Consigliere — Tutti i diritti riservati.
        </p>
      </footer>
    </div>
  );
}
