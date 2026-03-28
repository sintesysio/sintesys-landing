/*
 * Design: "La Prima Pagina" — Estilo Jornal Impresso Italiano Clássico
 * Paleta: Off-white (#FAFAF7), Preto (#1A1A1A), Navy (#1B2A4A)
 * Tipografia: Playfair Display (headlines), Source Serif 4 (body), Inter (labels/UI)
 * Layout: Grid assimétrico de jornal com masthead, manchetes e formulário
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/sintesys-logo_8369f699.png";
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/hero-newspaper-X6Nu9ZvEg3XFvxCoNGtAqn.webp";
const DATA_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/data-section-9fYjcLRyFVkjjbgNw5fX7E.webp";

const SECTORS = [
  "Manifattura",
  "Commercio all'ingrosso",
  "Commercio al dettaglio",
  "Servizi professionali",
  "Costruzioni",
  "Logistica e trasporti",
  "Ristorazione e hospitality",
  "Tecnologia",
  "Altro",
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

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

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    sector: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* MASTHEAD — Newspaper Header */}
      {/* ═══════════════════════════════════════════════════════ */}
      <header className="container pt-6 pb-0">
        {/* Top rule */}
        <div className="rule-thick mb-3" />

        {/* Top bar: date + edition */}
        <div className="flex items-center justify-between mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "#666" }}>
            {dateStr}
          </span>
          <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "#666" }}>
            Edizione N°001
          </span>
        </div>

        {/* Thin rule */}
        <div className="rule-thin mb-4" />

        {/* Masthead title */}
        <div className="text-center mb-1">
          <h1
            className="tracking-tight leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
              fontWeight: 900,
              color: "#1B2A4A",
              letterSpacing: "-0.02em",
            }}
          >
            IL GIORNALE DELL'IA
          </h1>
          <p
            className="mt-1 tracking-[0.3em] uppercase"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.55rem, 1.2vw, 0.75rem)",
              color: "#888",
              fontWeight: 400,
            }}
          >
            Strategie Operative per PMI Italiane &mdash; by Sintesys.io
          </p>
        </div>

        {/* Bottom rules */}
        <div className="rule-thin mt-4" />
        <div className="rule-thick mt-1" />
      </header>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO — Main Headline + Subscription Form */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-8 lg:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left column: Main article */}
          <div className="lg:col-span-7">
            <FadeIn>
              <p
                className="uppercase tracking-[0.15em] mb-3"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  color: "#1B2A4A",
                  fontWeight: 600,
                }}
              >
                Editoriale
              </p>
              <h2
                className="leading-[1.1] mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.75rem, 4vw, 3.2rem)",
                  fontWeight: 700,
                  color: "#1A1A1A",
                }}
              >
                Riprendi il controllo
                <br />
                della tua azienda.
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="rule-thin mb-6" />
              <p
                className="drop-cap leading-relaxed mb-6"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                  color: "#333",
                  lineHeight: 1.8,
                }}
              >
                L'88% degli imprenditori italiani sa di dover innovare, ma solo il 26% agisce.
                Il motivo? Troppo rumore di fondo, troppa confusione e soluzioni pensate per le
                multinazionali, non per la realtà di una PMI con 10-50 dipendenti.
              </p>
              <p
                className="leading-relaxed mb-6"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                  color: "#333",
                  lineHeight: 1.8,
                }}
              >
                Mentre gli altri ti parlano di "rivoluzione" e tool miracolosi, noi parliamo la tua lingua:{" "}
                <strong style={{ color: "#1B2A4A" }}>Marginalità, Controllo, Efficienza e Flusso di Cassa.</strong>
              </p>
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                  color: "#333",
                  lineHeight: 1.8,
                }}
              >
                Iscrivendoti alla nostra lista esclusiva, riceverai materiali strategici periodici
                che tradurranno l'Intelligenza Artificiale in impatto reale sui tuoi margini.
                Nessun gergo tecnico. Solo strategia pura, da imprenditore a imprenditore.
              </p>
            </FadeIn>

            {/* Hero image */}
            <FadeIn delay={0.2}>
              <div className="mt-8 mb-2">
                <img
                  src={HERO_IMG}
                  alt="Il Giornale dell'IA - Intelligenza Artificiale per PMI"
                  className="w-full"
                  style={{ filter: "grayscale(10%)" }}
                />
                <p
                  className="mt-2 italic"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.8rem",
                    color: "#888",
                  }}
                >
                  L'Intelligenza Artificiale non è più un'opzione. È l'infrastruttura del futuro.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Right column: Subscription form */}
          <div className="lg:col-span-5">
            <FadeIn delay={0.15}>
              <div className="lg:sticky lg:top-8">
                {/* Vertical rule on desktop */}
                <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: "oklch(0.80 0.005 60)" }} />

                <div className="lg:pl-8">
                  {/* Form header */}
                  <div className="rule-thick mb-4" />
                  <p
                    className="uppercase tracking-[0.15em] mb-2"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.65rem",
                      color: "#1B2A4A",
                      fontWeight: 600,
                    }}
                  >
                    Accesso Riservato
                  </p>
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      lineHeight: 1.2,
                    }}
                  >
                    Unisciti agli imprenditori che non navigano più a vista.
                  </h3>
                  <p
                    className="mb-6"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "0.95rem",
                      color: "#555",
                      lineHeight: 1.6,
                    }}
                  >
                    Ricevi analisi, dati e strategie operative sull'IA, pensate esclusivamente per i titolari di PMI italiane.
                  </p>
                  <div className="rule-thin mb-6" />

                  {/* Form */}
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label
                          className="block mb-1.5 uppercase tracking-[0.1em]"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            color: "#1B2A4A",
                          }}
                        >
                          Nome e Cognome
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Il tuo nome"
                          className="w-full px-0 py-2.5 bg-transparent border-0 border-b transition-colors focus:outline-none focus:ring-0"
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1rem",
                            color: "#1A1A1A",
                            borderColor: "#ddd",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        />
                      </div>

                      <div>
                        <label
                          className="block mb-1.5 uppercase tracking-[0.1em]"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            color: "#1B2A4A",
                          }}
                        >
                          Email Professionale
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="la.tua.email@azienda.it"
                          className="w-full px-0 py-2.5 bg-transparent border-0 border-b transition-colors focus:outline-none focus:ring-0"
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1rem",
                            color: "#1A1A1A",
                            borderColor: "#ddd",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        />
                      </div>

                      <div>
                        <label
                          className="block mb-1.5 uppercase tracking-[0.1em]"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            color: "#1B2A4A",
                          }}
                        >
                          Telefono
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+39 000 000 0000"
                          className="w-full px-0 py-2.5 bg-transparent border-0 border-b transition-colors focus:outline-none focus:ring-0"
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1rem",
                            color: "#1A1A1A",
                            borderColor: "#ddd",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        />
                        <p
                          className="mt-1"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.65rem",
                            color: "#999",
                          }}
                        >
                          Per inviti a tavole rotonde esclusive
                        </p>
                      </div>

                      <div>
                        <label
                          className="block mb-1.5 uppercase tracking-[0.1em]"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            color: "#1B2A4A",
                          }}
                        >
                          Settore / Tipo di Business
                        </label>
                        <select
                          required
                          value={formData.sector}
                          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                          className="w-full px-0 py-2.5 bg-transparent border-0 border-b transition-colors focus:outline-none focus:ring-0 appearance-none"
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1rem",
                            color: formData.sector ? "#1A1A1A" : "#999",
                            borderColor: "#ddd",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        >
                          <option value="" disabled>
                            Seleziona il tuo settore
                          </option>
                          {SECTORS.map((s) => (
                            <option key={s} value={s} style={{ color: "#1A1A1A" }}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 mt-2 transition-all duration-300"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          backgroundColor: submitting ? "#2a3a5a" : "#1B2A4A",
                          color: "#FAFAF7",
                          border: "none",
                        }}
                        onMouseEnter={(e) => {
                          if (!submitting) e.currentTarget.style.backgroundColor = "#0f1d36";
                        }}
                        onMouseLeave={(e) => {
                          if (!submitting) e.currentTarget.style.backgroundColor = "#1B2A4A";
                        }}
                      >
                        {submitting ? "Elaborazione..." : "Accedi ai Materiali Strategici"}
                      </button>

                      <p
                        className="text-center mt-3"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.65rem",
                          color: "#aaa",
                          lineHeight: 1.5,
                        }}
                      >
                        I tuoi dati sono al sicuro. Rispettiamo la tua privacy
                        e odiamo lo spam esattamente quanto te.
                      </p>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-8"
                    >
                      <div
                        className="inline-flex items-center justify-center w-16 h-16 mb-4"
                        style={{
                          border: "2px solid #1B2A4A",
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <h3
                        className="mb-2"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "#1A1A1A",
                        }}
                      >
                        Benvenuto, {formData.name.split(" ")[0]}.
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Source Serif 4', serif",
                          fontSize: "1rem",
                          color: "#555",
                          lineHeight: 1.6,
                        }}
                      >
                        Riceverai il primo materiale strategico direttamente nella tua casella di posta.
                        Controlla anche la cartella spam.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DATA SECTION — Statistics */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-16 lg:mt-24">
        <div className="rule-thick mb-8" />
        <FadeIn>
          <p
            className="uppercase tracking-[0.15em] mb-2"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              color: "#1B2A4A",
              fontWeight: 600,
            }}
          >
            I Numeri
          </p>
          <h2
            className="mb-8"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.15,
            }}
          >
            Il paradosso delle PMI italiane.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {[
            {
              number: 88,
              suffix: "%",
              label: "vuole innovare",
              desc: "degli imprenditori italiani dichiara di voler innovare la propria azienda",
              source: "Politecnico di Milano",
            },
            {
              number: 26,
              suffix: "%",
              label: "agisce davvero",
              desc: "ha effettivamente implementato soluzioni digitali strutturate",
              source: "Politecnico di Milano",
            },
            {
              number: 42,
              suffix: "%",
              label: "fatica col credito",
              desc: "delle PMI ha difficoltà di accesso al credito bancario per investire",
              source: "Banca d'Italia",
            },
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div
                className="py-8 md:px-8 first:md:pl-0 last:md:pr-0"
                style={{
                  borderTop: "1px solid oklch(0.80 0.005 60)",
                  borderLeft: i > 0 ? "1px solid oklch(0.80 0.005 60)" : "none",
                }}
              >
                <div
                  className="mb-2"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(3rem, 6vw, 4.5rem)",
                    fontWeight: 900,
                    color: "#1B2A4A",
                    lineHeight: 1,
                  }}
                >
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <p
                  className="uppercase tracking-[0.1em] mb-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "#1B2A4A",
                  }}
                >
                  {stat.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.95rem",
                    color: "#555",
                    lineHeight: 1.6,
                  }}
                >
                  {stat.desc}
                </p>
                <p
                  className="mt-2 italic"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.75rem",
                    color: "#999",
                  }}
                >
                  Fonte: {stat.source}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* VALUE PROPS — Three columns like newspaper sections */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-16 lg:mt-24">
        <div className="rule-thick mb-8" />
        <FadeIn>
          <p
            className="uppercase tracking-[0.15em] mb-2"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              color: "#1B2A4A",
              fontWeight: 600,
            }}
          >
            Cosa Riceverai
          </p>
          <h2
            className="mb-10"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.15,
            }}
          >
            Materiali strategici, non teoria.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {[
            {
              title: "Eliminare il caos operazionale",
              body: "Scopri come centralizzare le informazioni e smettere di dipendere dai fogli Excel e dalla memoria dei singoli dipendenti. Analisi concrete su come le PMI italiane stanno organizzando i propri flussi informativi.",
              tag: "Governance",
            },
            {
              title: "Governare la \"Shadow AI\"",
              body: "I tuoi dipendenti stanno già usando ChatGPT di nascosto, esponendo dati sensibili senza alcun controllo. Ricevi strategie per governare l'IA nella tua azienda, proteggendo i dati e rispettando l'AI Act europeo.",
              tag: "Sicurezza",
            },
            {
              title: "Sfruttare gli incentivi",
              body: "Oltre il 60% degli imprenditori non conosce gli incentivi di Transizione 5.0. Ricevi aggiornamenti chiari su come far pagare allo Stato fino al 50% della tua innovazione digitale.",
              tag: "Opportunità",
            },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div
                className="py-8 md:px-8 first:md:pl-0 last:md:pr-0"
                style={{
                  borderTop: "1px solid oklch(0.80 0.005 60)",
                  borderLeft: i > 0 ? "1px solid oklch(0.80 0.005 60)" : "none",
                }}
              >
                <span
                  className="inline-block mb-3 px-2 py-0.5"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#1B2A4A",
                    border: "1px solid #1B2A4A",
                  }}
                >
                  {item.tag}
                </span>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    lineHeight: 1.25,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.95rem",
                    color: "#555",
                    lineHeight: 1.7,
                  }}
                >
                  {item.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DATA IMAGE — Infographic */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-16 lg:mt-24">
        <FadeIn>
          <div className="rule-thin mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <img
                src={DATA_IMG}
                alt="L'Adozione dell'IA nelle PMI Italiane — 88% vs 26%"
                className="w-full"
              />
            </div>
            <div className="lg:col-span-5">
              <p
                className="uppercase tracking-[0.15em] mb-2"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  color: "#1B2A4A",
                  fontWeight: 600,
                }}
              >
                Analisi
              </p>
              <h3
                className="mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.2,
                }}
              >
                Il divario tra intenzione e azione.
              </h3>
              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1rem",
                  color: "#555",
                  lineHeight: 1.7,
                }}
              >
                I dati del Politecnico di Milano rivelano un paradosso strutturale: quasi 9 imprenditori
                su 10 riconoscono la necessità di innovare, ma meno di 3 su 10 hanno effettivamente
                agito. La nostra newsletter ti aiuta a passare dal primo gruppo al secondo, con
                strategie concrete e misurabili.
              </p>
            </div>
          </div>
          <div className="rule-thin mt-6" />
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* QUOTE — Pull quote section */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-16 lg:mt-24">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center py-12">
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "5rem",
                color: "#1B2A4A",
                lineHeight: 0.5,
                display: "block",
                marginBottom: "1rem",
              }}
            >
              &ldquo;
            </span>
            <blockquote
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                fontWeight: 500,
                fontStyle: "italic",
                color: "#1A1A1A",
                lineHeight: 1.5,
              }}
            >
              Nessuna formula magica. Nessuna vendita aggressiva.
              Solo strategia pura, da imprenditore a imprenditore,
              con il rigore analitico che meriti.
            </blockquote>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECONDARY CTA — Bottom subscription */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-8 lg:mt-16 mb-16">
        <div className="rule-thick mb-8" />
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2
                className="mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.15,
                }}
              >
                Non restare indietro.
              </h2>
              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "#555",
                  lineHeight: 1.7,
                }}
              >
                Ogni settimana, migliaia di PMI italiane perdono terreno perché non hanno accesso
                alle informazioni giuste. Iscriviti per ricevere analisi esclusive che trasformano
                la complessità dell'IA in decisioni operative concrete.
              </p>
            </div>
            <div className="lg:col-span-5">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-block w-full text-center py-4 transition-all duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  backgroundColor: "#1B2A4A",
                  color: "#FAFAF7",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0f1d36")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1B2A4A")}
              >
                Iscriviti Ora — È Gratuito
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <footer className="container pb-8">
        <div className="rule-thin mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src={LOGO_URL}
            alt="Sintesys.io"
            className="h-8 object-contain"
            style={{ filter: "brightness(0)" }}
          />
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "#999",
            }}
          >
            © {today.getFullYear()} Sintesys.io — Tutti i diritti riservati.
          </p>
          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/sintesys.io/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1B2A4A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
            >
              Instagram
            </a>
            <a
              href="https://sintesys.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1B2A4A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
            >
              Sito Web
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
