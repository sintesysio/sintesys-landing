/**
 * Chi Siamo — About page for Il Consigliere
 * Positions Lamberto Grinover as an executive consultant in technological innovation and AI.
 * Uses the same editorial newspaper style as the landing page.
 */

import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import SEOHead from "@/components/SEOHead";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";

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
      <SEOHead
        title="Chi è Il Consigliere — 28 anni di operations in multinazionali"
        description="Fondata da Lamberto Grinover. Da Nissan, Cushman & Wakefield, Tishman Speyer e Brookfield alle PMI italiane."
        path="/chi-siamo"
      />
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
            L'IA che le multinazionali usano. Adattata per la Sua PMI.
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
                    alt="Lamberto Grinover — Fondatore di Il Consigliere"
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
                28 anni in multinazionali. Oggi, al servizio della Sua PMI.
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
                  Lamberto Grinover. 28 anni in ruoli direttivi in quattro multinazionali — <strong>Nissan Italia, Cushman &amp; Wakefield, Tishman Speyer, Brookfield</strong> — gestendo operazioni per oltre €200M e team di 150+ persone.
                </p>
                <p>
                  Oggi porta quella stessa disciplina operativa alle PMI italiane: <strong>trasformare la complessità in marginalità misurabile</strong>.
                </p>
                <p>
                  Non parla di algoritmi. Parla la lingua dell'imprenditore: <strong>marginalità, controllo dei costi, efficienza e flusso di cassa</strong>. Non vende tecnologia — vende risultati misurabili, con il rigore analitico di chi ha gestito P&amp;L da centinaia di milioni.
                </p>
                <p>
                  Ha fondato <strong>Il Consigliere</strong> con una missione semplice — tradurre l'Intelligenza Artificiale in marginalità concreta per chi ha 10-50 dipendenti e margini da proteggere.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MISSIONE IL CONSIGLIERE */}
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
                desc: "Analizziamo i processi della Sua azienda per identificare dove l'IA può generare il massimo impatto sui margini, non dove fa più rumore.",
              },
              {
                number: "02",
                title: "Strategia su Misura",
                desc: "Progettiamo un piano di implementazione personalizzato per la Sua realtà — nessuna soluzione preconfezionata, solo strategie calibrate sul Suo settore e le Sue dimensioni.",
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
                "Nessun imprenditore dovrebbe affrontare questa trasformazione da solo. L'IA è lo strumento. Il risultato è la Sua azienda che funziona meglio — con meno costi, meno errori e più tempo per ciò che conta."
              </blockquote>
              <p
                className="mt-4 uppercase tracking-[0.15em]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  color: "#999",
                }}
              >
                — Lamberto Grinover, Fondatore Il Consigliere
              </p>
              <div className="rule-thin mt-8 max-w-md mx-auto" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PERCHÉ ORA — Scarsità onesta                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container pb-16">
        <FadeIn>
          <div
            className="p-8 lg:p-12"
            style={{
              backgroundColor: "rgba(27,42,74,0.04)",
              border: "1px solid rgba(27,42,74,0.12)",
            }}
          >
            <p
              className="uppercase tracking-[0.15em] mb-3"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                color: "#C4704B",
                fontWeight: 600,
              }}
            >
              Perché ora
            </p>
            <h2
              className="mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                fontWeight: 700,
                color: "#1A1A1A",
                lineHeight: 1.25,
              }}
            >
              Nei primi 12 mesi, seguiamo al massimo 50–80 aziende.
            </h2>
            <p
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1.05rem",
                color: "#444",
                lineHeight: 1.7,
                maxWidth: "640px",
              }}
            >
              Ogni imprenditore riceve attenzione diretta, non un pacchetto standardizzato. Questo significa che i posti disponibili per nuove collaborazioni sono limitati. Se la sua PMI ha bisogno di chiarezza operativa sull'IA, il momento migliore per parlarne è adesso.
            </p>
            <div className="mt-6">
              <a
                href="/contattaci"
                className="inline-block px-6 py-3 text-xs uppercase tracking-[0.15em]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  backgroundColor: "#1B2A4A",
                  color: "#FAFAF7",
                }}
              >
                Parli con Lamberto →
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <footer className="container pb-8" role="contentinfo">
        <div className="rule-thick mb-4" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <img src={LOGO_ICON} alt="Il Consigliere" className="h-6 w-6 rounded-full opacity-60" />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
              }}
            >
              &copy; {new Date().getFullYear()} Il Consigliere — Tutti i diritti riservati
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
