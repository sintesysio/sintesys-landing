/**
 * Thank You Page — /grazie
 * Exibida após inscrição na newsletter
 * Focus: confirm subscription + deliver lead magnet + soft upsell
 */

import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { trackConversion } from "@/lib/tracking";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";

export default function Grazie() {
  useEffect(() => {
    trackConversion({ source: "thank_you_page" });
  }, []);

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      <SEOHead
        title="Grazie — Iscrizione confermata | Il Consigliere"
        description="Riceverà la Guida Transizione 5.0 entro pochi minuti. Controlli anche lo spam."
        path="/grazie"
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
            Iscrizione Confermata!
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
            Benvenuto nella community di imprenditori italiani che stanno integrando l'IA nelle proprie aziende. La <strong>Guida Transizione 5.0</strong> è in arrivo nella sua casella email.
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
                  title: "Controlli la sua email",
                  desc: "Entro pochi minuti riceverà la Guida Transizione 5.0 — il documento che spiega come accedere ai €6,3 miliardi di fondi MIMIT per la digitalizzazione. Controlli anche la cartella spam.",
                },
                {
                  step: "2",
                  title: "Ogni settimana, una nuova edizione",
                  desc: "Ogni lunedì riceverà Il Giornale dell'IA — analisi esclusive, casi studio reali e strategie operative per integrare l'Intelligenza Artificiale nella sua PMI.",
                },
                {
                  step: "3",
                  title: "Risultati concreti",
                  desc: "Non parliamo di teoria. Ogni edizione contiene almeno un'azione implementabile nella sua azienda entro la settimana — con impatto misurabile su costi, tempo o marginalità.",
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

          {/* Soft upsell — Mappa delle Opportunità IA */}
          <div
            className="p-6 lg:p-8 mb-6"
            style={{
              backgroundColor: "#fff",
              border: "2px solid #C4704B",
            }}
          >
            <p
              className="uppercase tracking-[0.15em] mb-2"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.6rem",
                color: "#C4704B",
                fontWeight: 600,
              }}
            >
              Mentre aspetta la prima edizione
            </p>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#1A1A1A",
                lineHeight: 1.25,
                marginBottom: "0.5rem",
              }}
            >
              Scopra dove l'IA può intervenire nella sua azienda
            </h3>
            <p
              className="mb-4"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "0.95rem",
                color: "#444",
                lineHeight: 1.7,
              }}
            >
              Abbiamo costruito uno strumento che le mostra in 30 minuti dove l'IA può intervenire nella <strong>SUA</strong> azienda specifica — lo stesso che usiamo come punto di partenza con i nostri clienti di consulenza.
            </p>
            <p
              className="mb-4"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "0.9rem",
                color: "#555",
                lineHeight: 1.6,
              }}
            >
              Si chiama <strong>Mappa delle Opportunità IA</strong>. 80 processi analizzati, 8 dipartimenti, ROI stimato per ogni intervento.
            </p>
            <div className="flex items-center gap-3 mb-2">
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#999",
                  textDecoration: "line-through",
                }}
              >
                €129,90
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#C4704B",
                }}
              >
                €49,50
              </span>
            </div>
            <p
              className="mb-4"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
              }}
            >
              Prezzo di lancio (fino ai primi 100 clienti) · Garanzia 14 giorni inclusa
            </p>
            <a
              href="https://buy.stripe.com/6oU9ANd3Q0MkaAvgXVdIA01"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block no-underline px-6 py-2.5"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FAFAF7",
                backgroundColor: "#C4704B",
              }}
            >
              Acquista la Mappa — €49,50 →
            </a>
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
          © {new Date().getFullYear()} Il Consigliere — Tutti i diritti riservati.
        </p>
      </footer>
    </div>
  );
}
