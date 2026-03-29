/**
 * Chi Siamo — About page for Sintesys.io
 * Positions Lamberto Grinover as an executive consultant in technological innovation and AI.
 * Uses the same editorial newspaper style as the landing page.
 */

import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";

const BRAIN_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/brain-icon_a74d4c28.png";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ChiSiamo() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      <NavBar />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PAGE HEADER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <header className="container pt-10 pb-6">
        <div className="text-center">
          <p
            className="uppercase tracking-[0.2em] mb-2"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}
          >
            Chi Siamo
          </p>
          <h1
            className="leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 900,
              color: "#1B2A4A",
              letterSpacing: "-0.02em",
            }}
          >
            Innovazione Tecnologica al Servizio delle PMI
          </h1>
          <div className="rule-thin mt-6 max-w-2xl mx-auto" />
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* LAMBERTO GRINOVER — FOUNDER SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Left: Photo + credentials */}
          <div className="lg:col-span-4">
            <FadeIn>
              <div
                className="p-6 text-center"
                style={{
                  border: "1px solid oklch(0.80 0.005 60)",
                  backgroundColor: "#fff",
                }}
              >
                {/* Photo of Lamberto Grinover */}
                <div
                  className="w-32 h-32 mx-auto mb-4 overflow-hidden"
                  style={{
                    border: "3px solid #1B2A4A",
                    borderRadius: "50%",
                  }}
                >
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/lamberto-grinover_a1c8f6fb.png"
                    alt="Lamberto Grinover — Fondatore di Sintesys.io"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    width="128"
                    height="128"
                  />
                </div>

                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    marginBottom: "0.25rem",
                  }}
                >
                  Lamberto Grinover
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#1B2A4A",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "1rem",
                  }}
                >
                  Fondatore &amp; Consulente Esecutivo
                </p>

                <div className="rule-thin mb-4" />

                <div className="text-left space-y-3">
                  {[
                    { label: "Esperienza", value: "Oltre 28 anni in ruoli direttivi" },
                    { label: "Multinazionali", value: "Nissan Italia, Cushman & Wakefield, Tishman Speyer, Brookfield" },
                    { label: "Formazione", value: "Ingegneria Meccanica" },
                    { label: "Focus", value: "Innovazione Tecnologica & IA per PMI" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p
                        className="uppercase tracking-[0.1em] mb-0.5"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "#999" }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Source Serif 4', serif",
                          fontSize: "0.85rem",
                          color: "#1A1A1A",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rule-thin mt-4 mb-3" />

                <a
                  href="https://www.linkedin.com/in/lamberto-grinover-2950384"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 no-underline px-4 py-2 text-xs tracking-[0.1em] uppercase transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: "#1B2A4A",
                    border: "1px solid #1B2A4A",
                    fontWeight: 500,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Right: Editorial biography */}
          <div className="lg:col-span-8">
            <FadeIn delay={0.1}>
              <p
                className="uppercase tracking-[0.15em] mb-3"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  color: "#999",
                  borderLeft: "3px solid #1B2A4A",
                  paddingLeft: "0.75rem",
                }}
              >
                Il Fondatore
              </p>

              <h2
                className="mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.2,
                }}
              >
                Da Direttore in Multinazionali a Consulente per l'Innovazione Tecnologica delle PMI
              </h2>

              <div
                className="space-y-4 drop-cap"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "#333",
                  lineHeight: 1.75,
                }}
              >
                <p>
                  Con oltre 28 anni di esperienza in ruoli direttivi presso multinazionali come <strong>Nissan Italia</strong>, <strong>Cushman &amp; Wakefield</strong>, <strong>Tishman Speyer</strong> e <strong>Brookfield</strong>, Lamberto Grinover ha maturato una visione unica su come le grandi organizzazioni utilizzano la tecnologia per creare efficienza operativa e vantaggio competitivo.
                </p>
                <p>
                  Trasferitosi in Italia nel 2023, ha fondato <strong>Sintesys.io</strong> con una missione chiara: portare alle Piccole e Medie Imprese italiane lo stesso livello di innovazione tecnologica e Intelligenza Artificiale che fino a oggi era riservato solo alle grandi aziende.
                </p>
                <p>
                  La sua forza non è solo la competenza tecnica, ma la capacità di <strong>ascoltare e comprendere le reali necessità aziendali</strong>, di dialogare con CEO e imprenditori parlando la loro lingua: marginalità, controllo dei costi, efficienza e flusso di cassa. Non vende tecnologia. Vende risultati misurabili.
                </p>
                <p>
                  In un mercato dove il 62% delle PMI italiane non ha ancora un piano strutturato per l'adozione dell'IA, Lamberto si posiziona come il <strong>consulente esecutivo</strong> che trasforma la complessità tecnologica in decisioni operative concrete — in 90 giorni, non in anni.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MISSIONE SINTESYS.IO */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="rule-double mb-8" />

          <FadeIn>
            <div className="text-center mb-8">
              <p
                className="uppercase tracking-[0.2em] mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}
              >
                La Nostra Missione
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  color: "#1B2A4A",
                  lineHeight: 1.2,
                }}
              >
                Rendere l'Intelligenza Artificiale Accessibile a Ogni PMI Italiana
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                number: "01",
                title: "Diagnosi Operativa",
                desc: "Analizziamo i processi della tua azienda per identificare dove l'IA può generare il massimo impatto sui margini, non dove fa più rumore.",
              },
              {
                number: "02",
                title: "Strategia su Misura",
                desc: "Progettiamo un piano di implementazione personalizzato per la tua realtà — nessuna soluzione preconfezionata, solo strategie calibrate sul tuo settore e le tue dimensioni.",
              },
              {
                number: "03",
                title: "Risultati in 90 Giorni",
                desc: "Implementiamo soluzioni concrete con ROI misurabile entro 90 giorni. Automatizzazione, ottimizzazione dei costi e governance dei dati — tutto verificabile.",
              },
            ].map((item, i) => (
              <FadeIn key={item.number} delay={i * 0.1}>
                <div
                  className="p-6 h-full"
                  style={{
                    border: "1px solid oklch(0.80 0.005 60)",
                    backgroundColor: "#fff",
                  }}
                >
                  <span
                    className="block mb-3"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "2rem",
                      fontWeight: 700,
                      color: "#1B2A4A",
                      opacity: 0.3,
                    }}
                  >
                    {item.number}
                  </span>
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "#1A1A1A",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "0.95rem",
                      color: "#555",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Values */}
          <FadeIn delay={0.2}>
            <div className="mt-12 text-center">
              <div className="rule-thin mb-8 max-w-md mx-auto" />
              <blockquote
                className="max-w-3xl mx-auto"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                  fontStyle: "italic",
                  color: "#1B2A4A",
                  lineHeight: 1.5,
                }}
              >
                "Non vendiamo tecnologia. Traduciamo l'Intelligenza Artificiale in impatto reale sui tuoi margini — con il rigore di chi ha gestito operazioni in quattro multinazionali."
              </blockquote>
              <p
                className="mt-4 uppercase tracking-[0.15em]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  color: "#999",
                }}
              >
                — Lamberto Grinover, Fondatore Sintesys.io
              </p>
              <div className="rule-thin mt-8 max-w-md mx-auto" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <footer className="container pb-8" role="contentinfo">
        <div className="rule-thick mb-4" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <img src={BRAIN_ICON} alt="Sintesys.io" className="h-6 w-6 rounded-full opacity-60" />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
              }}
            >
              &copy; {new Date().getFullYear()} Sintesys.io — Tutti i diritti riservati
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              color: "#bbb",
              letterSpacing: "0.05em",
            }}
          >
            Strategie Operative di IA per PMI Italiane
          </span>
        </div>
      </footer>
    </div>
  );
}
