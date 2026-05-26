/**
 * Thank You Page — /grazie
 * Fase 1: Sem venda de Masterclass
 *
 * Diagnóstico aplicado:
 * 1. REMOVIDO: CTA "Scopri la Masterclass" (Fase 1 = sem venda)
 * 2. CORRIGIDO: H1 humano, não "Iscrizione Confermata!"
 * 3. REMOVIDO: "community" — não existe
 * 4. CORRIGIDO: Instrução email com remetente, assunto, tempo, spam
 * 5. CORRIGIDO: "Compili la Mappa" com motivação e resultado
 * 6. CONFIRMADO: Pixel Lead event disparado
 * 7. CORRIGIDO: Link Giornale com descrição clara
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
    // Fire Meta Pixel Lead event (standard event)
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", { content_name: "newsletter" });
    }
  }, []);

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      <SEOHead
        title="Benvenuto — La Mappa è in arrivo | Il Consigliere"
        description="Ha fatto la scelta giusta. In meno di 5 minuti riceve la Mappa delle Opportunità IA e la Guida Transizione 5.0."
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

          {/* FIX #2: Headline humana, não "Iscrizione Confermata!" */}
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
            Benvenuto. La Mappa è in arrivo.
          </h1>

          {/* FIX #3: Sem "community" — subheadline honesta */}
          <p
            className="mb-8"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.15rem",
              color: "#444",
              lineHeight: 1.7,
            }}
          >
            Ha fatto la scelta giusta. In meno di 5 minuti riceve via email la <strong>Mappa delle Opportunità IA</strong> e la <strong>Guida Transizione 5.0</strong>.
          </p>

          {/* Steps — FIX #4 e #5 */}
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
              Cosa fare adesso
            </h2>
            <div className="space-y-5">
              {[
                {
                  step: "1",
                  title: "Controlli la sua email",
                  desc: "Arriva da lamberto@ilconsigliere.io con oggetto: \"La sua Mappa è pronta\". Se non la trova entro 5 minuti, controlli la cartella spam e sposti il mittente in \"affidabile\".",
                },
                {
                  step: "2",
                  title: "Compili la Mappa",
                  desc: "Dedichi 10 minuti a scorrere gli 80 processi. Identifichi i 3 con il maggior potenziale per la sua azienda — saranno le priorità da cui partire. Il valore non è nel foglio: è nei numeri che lei ci mette dentro.",
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

          {/* FIX #1: REMOVIDO bloco upsell Masterclass — Fase 1 */}

          {/* FIX #7: Giornale com descrição clara */}
          <div
            className="p-6"
            style={{
              backgroundColor: "rgba(27,42,74,0.04)",
              border: "1px solid rgba(27,42,74,0.1)",
            }}
          >
            <p
              className="mb-2"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1rem",
                color: "#1A1A1A",
                lineHeight: 1.5,
                fontWeight: 600,
              }}
            >
              Nel frattempo, legga gli ultimi casi pratici.
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
              <strong>Il Giornale dell'IA</strong> — ogni settimana un caso reale di PMI italiana che ha implementato l'IA. Niente teoria. Solo quello che ha funzionato e perché.
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
              Leggi Il Giornale dell'IA →
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
