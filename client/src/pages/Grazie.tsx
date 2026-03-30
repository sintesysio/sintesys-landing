/**
 * Thank You Page — /grazie
 * Exibida após submit do formulário da Landing Page
 * Foco: confirmar próximos passos + reforçar valor
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { trackConversion } from "@/lib/tracking";

const BRAIN_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/brain-icon_a74d4c28.png";

export default function Grazie() {
  useEffect(() => {
    trackConversion({ source: "thank_you_page" });
  }, []);

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      {/* Navbar minimal */}
      <nav className="container" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="rule-thick mt-0" />
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <img src={BRAIN_ICON} alt="Sintesys.io" className="h-8 w-8 rounded-full" loading="eager" />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Sintesys.io
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
            style={{ backgroundColor: "rgba(27,42,74,0.08)" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            Richiesta Ricevuta!
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
            Lamberto Grinover analizzerà personalmente il suo profilo aziendale e la contatterà <strong>entro 24 ore</strong> per fissare la sessione strategica gratuita di 30 minuti.
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
              Cosa succede adesso?
            </h2>
            <div className="space-y-5">
              {[
                {
                  step: "1",
                  title: "Analisi del profilo",
                  desc: "Lamberto esamina le informazioni fornite per preparare un'analisi preliminare del suo settore e delle opportunità specifiche.",
                },
                {
                  step: "2",
                  title: "Contatto entro 24h",
                  desc: "Riceverà un'email o una telefonata per concordare data e orario della sessione strategica.",
                },
                {
                  step: "3",
                  title: "Sessione di 30 minuti",
                  desc: "Una videochiamata dedicata dove Lamberto le mostrerà esattamente dove l'IA può migliorare la sua azienda, con numeri concreti.",
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
                      backgroundColor: "#1B2A4A",
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
              Mentre aspetta, scopra <strong>Il Giornale dell'IA</strong> — strategie operative di Intelligenza Artificiale per imprenditori italiani, aggiornate ogni giorno.
            </p>
            <Link
              href="/giornale"
              className="inline-block no-underline px-6 py-2.5 transition-all"
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
          © {new Date().getFullYear()} Sintesys.io — Tutti i diritti riservati.
        </p>
      </footer>
    </div>
  );
}
