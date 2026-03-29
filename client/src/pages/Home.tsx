/*
 * Design: "La Prima Pagina" — Estilo Jornal Impresso Italiano Clássico
 * Paleta: Off-white (#FAFAF7), Preto (#1A1A1A), Navy (#1B2A4A)
 * Tipografia: Playfair Display (headlines), Source Serif 4 (body), Inter (labels/UI)
 * Layout: Grid assimétrico de jornal com masthead, manchetes e formulário
 * 
 * DYNAMIC CONTENT: The page fetches today's editorial edition from the API.
 * If no edition is available, it falls back to static default content.
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { trpc } from "@/lib/trpc";
import NavBar from "@/components/NavBar";

const BRAIN_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/brain-icon_a74d4c28.png";
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

// ─── Static fallback content (used when API has no edition) ─────────
const FALLBACK = {
  dateFormatted: (() => {
    const now = new Date();
    const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  })(),
  editionNumber: "001",
  headline: "Riprendi il controllo della tua azienda.",
  editorialP1: "L'88% degli imprenditori italiani sa di dover innovare, ma solo il 26% agisce. Il motivo? Troppo rumore di fondo, troppa confusione e soluzioni pensate per le multinazionali, non per la realtà di una PMI con 10-50 dipendenti.",
  editorialP2: "Mentre gli altri ti parlano di \"rivoluzione\" e tool miracolosi, noi parliamo la tua lingua: Marginalità, Controllo, Efficienza e Flusso di Cassa.",
  editorialP3: "Iscrivendoti alla nostra lista esclusiva, riceverai materiali strategici periodici che tradurranno l'Intelligenza Artificiale in impatto reale sui tuoi margini. Nessun gergo tecnico. Solo strategia pura, da imprenditore a imprenditore.",
  imageCaption: "L'Intelligenza Artificiale non è più un'opzione. È l'infrastruttura del futuro.",
  statsTitle: "Il paradosso delle PMI italiane.",
  stats: [
    { number: 88, suffix: "%", label: "vuole innovare", desc: "degli imprenditori italiani dichiara di voler innovare la propria azienda", source: "Politecnico di Milano" },
    { number: 26, suffix: "%", label: "agisce davvero", desc: "ha effettivamente implementato soluzioni digitali strutturate", source: "Politecnico di Milano" },
    { number: 42, suffix: "%", label: "fatica col credito", desc: "delle PMI ha difficoltà di accesso al credito bancario per investire", source: "Banca d'Italia" },
  ],
  quote: "Nessuna formula magica. Nessuna vendita aggressiva. Solo strategia pura, da imprenditore a imprenditore, con il rigore analitico che meriti.",
  ctaTitle: "Non restare indietro.",
  ctaText: "Ogni settimana, migliaia di PMI italiane perdono terreno perché non hanno accesso alle informazioni giuste. Iscriviti per ricevere analisi esclusive che trasformano la complessità dell'IA in decisioni operative concrete.",
};

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
  const [errorMsg, setErrorMsg] = useState("");

  // ─── Fetch today's dynamic content ─────────────────────────
  const { data: dailyContent } = trpc.dailyContent.today.useQuery(undefined, {
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    retry: 1,
  });

  // Merge API content with fallback
  const content = useMemo(() => {
    if (dailyContent) return dailyContent;
    return FALLBACK;
  }, [dailyContent]);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setSubmitting(false);
    },
    onError: (error) => {
      setSubmitting(false);
      setErrorMsg(error.message || "Errore durante l'iscrizione. Riprova.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    submitLead.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      sector: formData.sector,
      source: "landing_page",
    });
  };

  // Highlight bold text in editorial paragraphs
  const renderBoldText = (text: string) => {
    // Simple bold: wrap text between ** ** or words like "Marginalità, Controllo..."
    return text;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      <NavBar />
      {/* ═══════════════════════════════════════════════════════ */}
      {/* MASTHEAD — Newspaper Header */}
      {/* ═══════════════════════════════════════════════════════ */}
      <header className="container pt-6 pb-0" role="banner" aria-label="Il Giornale dell'IA - Testata">
        {/* Top rule */}
        <div className="rule-thick mb-3" />

        {/* Top bar: date + edition — DYNAMIC */}
        <div className="flex items-center justify-between mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "#666" }}>
            {content.dateFormatted}
          </span>
          <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "#666" }}>
            Edizione N°{content.editionNumber}
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
      {/* HERO — Main Headline + Subscription Form — DYNAMIC */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-8 lg:mt-12" id="editoriale" aria-label="Editoriale principale">
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
                {content.headline}
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
                {content.editorialP1}
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
                {content.editorialP2}
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
                {content.editorialP3}
              </p>
            </FadeIn>

            {/* Hero image */}
            <FadeIn delay={0.2}>
              <div className="mt-8 mb-2">
                <img
                  src={HERO_IMG}
                  alt="Intelligenza Artificiale per PMI italiane — strategie operative per imprenditori"
                  className="w-full"
                  loading="lazy"
                  width="800"
                  height="500"
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
                  {content.imageCaption}
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
                    className="mb-1"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      lineHeight: 1.2,
                    }}
                  >
                    Ricevi materiali strategici.
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
                    Analisi esclusive sull'IA per PMI italiane, direttamente nella tua casella di posta.
                  </p>

                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block mb-1"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#666",
                          }}
                        >
                          Nome e Cognome *
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          autoComplete="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2.5 transition-colors"
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "0.95rem",
                            border: "1px solid oklch(0.80 0.005 60)",
                            backgroundColor: "transparent",
                            color: "#1A1A1A",
                            outline: "none",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "oklch(0.80 0.005 60)")}
                          placeholder="Mario Rossi"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-1"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#666",
                          }}
                        >
                          Email Aziendale *
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2.5 transition-colors"
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "0.95rem",
                            border: "1px solid oklch(0.80 0.005 60)",
                            backgroundColor: "transparent",
                            color: "#1A1A1A",
                            outline: "none",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "oklch(0.80 0.005 60)")}
                          placeholder="mario@azienda.it"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block mb-1"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#666",
                          }}
                        >
                          Telefono
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2.5 transition-colors"
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "0.95rem",
                            border: "1px solid oklch(0.80 0.005 60)",
                            backgroundColor: "transparent",
                            color: "#1A1A1A",
                            outline: "none",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "oklch(0.80 0.005 60)")}
                          placeholder="+39 333 1234567"
                        />
                      </div>

                      {/* Sector */}
                      <div>
                        <label
                          htmlFor="sector"
                          className="block mb-1"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#666",
                          }}
                        >
                          Settore *
                        </label>
                        <select
                          id="sector"
                          required
                          value={formData.sector}
                          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                          className="w-full px-3 py-2.5 transition-colors"
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "0.95rem",
                            border: "1px solid oklch(0.80 0.005 60)",
                            backgroundColor: "transparent",
                            color: formData.sector ? "#1A1A1A" : "#999",
                            outline: "none",
                            appearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%23666' stroke-width='1.5'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "oklch(0.80 0.005 60)")}
                        >
                          <option value="" disabled>
                            Seleziona il tuo settore
                          </option>
                          {SECTORS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 transition-all duration-300"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          backgroundColor: submitting ? "#555" : "#1B2A4A",
                          color: "#FAFAF7",
                          border: "none",
                          cursor: submitting ? "wait" : "pointer",
                        }}
                        onMouseEnter={(e) => {
                          if (!submitting) e.currentTarget.style.backgroundColor = "#0f1d36";
                        }}
                        onMouseLeave={(e) => {
                          if (!submitting) e.currentTarget.style.backgroundColor = "#1B2A4A";
                        }}
                      >
                        {submitting ? "Invio in corso..." : "Iscriviti — È Gratuito"}
                      </button>

                      {/* Privacy note */}
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.6rem",
                          color: "#999",
                          lineHeight: 1.5,
                          textAlign: "center",
                        }}
                      >
                        I tuoi dati sono al sicuro. Nessuno spam, solo contenuti di valore.
                        <br />
                        Puoi cancellarti in qualsiasi momento.
                      </p>

                      {/* Error message */}
                      {errorMsg && (
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.75rem",
                            color: "#c0392b",
                            textAlign: "center",
                            marginTop: "0.5rem",
                          }}
                        >
                          {errorMsg}
                        </p>
                      )}
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
      {/* DATA SECTION — Statistics — DYNAMIC */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-16 lg:mt-24" id="numeri" aria-label="Statistiche sulle PMI italiane">
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
            {content.statsTitle}
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {content.stats.map((stat, i) => (
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
      <section className="container mt-16 lg:mt-24" id="materiali" aria-label="Materiali strategici">
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
      <section className="container mt-16 lg:mt-24" id="analisi" aria-label="Analisi del divario digitale">
        <FadeIn>
          <div className="rule-thin mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <img
                src={DATA_IMG}
                alt="Infografica: adozione dell'Intelligenza Artificiale nelle PMI italiane — 88% vuole innovare ma solo 26% agisce"
                className="w-full"
                loading="lazy"
                width="800"
                height="500"
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
      {/* TRANSIZIONE 5.0 — Incentivi Fiscali */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-16 lg:mt-24" id="transizione" aria-label="Incentivi Transizione 5.0">
        <div className="rule-thick mb-8" />
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <p
                className="uppercase tracking-[0.15em] mb-2"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  color: "#1B2A4A",
                  fontWeight: 600,
                }}
              >
                Incentivi Fiscali
              </p>
              <h2
                className="mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.15,
                }}
              >
                Transizione 5.0: lo Stato paga fino al 50% della tua innovazione.
              </h2>
              <div
                className="space-y-4"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "#333",
                  lineHeight: 1.75,
                }}
              >
                <p>
                  Il programma italiano <strong>Transizione 5.0</strong> offre crediti d'imposta e sussidi per la digitalizzazione delle PMI. Eppure, oltre il <strong>60% degli imprenditori italiani</strong> non conosce ancora questi incentivi — perdendo l'opportunità di finanziare fino alla metà del proprio progetto di innovazione.
                </p>
                <p>
                  La nostra newsletter ti tiene aggiornato su come accedere a questi fondi, quali requisiti servono e come strutturare il tuo investimento per massimizzare il ritorno. <strong>Non è teoria: è denaro reale che lo Stato mette a disposizione della tua azienda.</strong>
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div
                className="p-6 lg:p-8"
                style={{
                  backgroundColor: "#1B2A4A",
                }}
              >
                <p
                  className="uppercase tracking-[0.15em] mb-4"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.65rem",
                    color: "rgba(250,250,247,0.5)",
                    fontWeight: 500,
                  }}
                >
                  Il Dato Chiave
                </p>
                <div
                  className="mb-4"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(3.5rem, 7vw, 5rem)",
                    fontWeight: 900,
                    color: "#FAFAF7",
                    lineHeight: 1,
                  }}
                >
                  <AnimatedCounter target={60} suffix="%+" />
                </div>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "1rem",
                    color: "rgba(250,250,247,0.8)",
                    lineHeight: 1.6,
                  }}
                >
                  degli imprenditori italiani non conosce gli incentivi di Transizione 5.0 per la digitalizzazione della propria azienda.
                </p>
                <p
                  className="mt-3 italic"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.75rem",
                    color: "rgba(250,250,247,0.4)",
                  }}
                >
                  Fonte: MIMIT — Ministero delle Imprese e del Made in Italy
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FAQ — Domande Frequenti */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-16 lg:mt-24" id="faq" aria-label="Domande frequenti">
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
            Domande Frequenti
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
            Le risposte che cercavi.
          </h2>
        </FadeIn>

        <div className="max-w-3xl space-y-0">
          {[
            {
              q: "L'IA è troppo costosa per una PMI?",
              a: "No. Con il programma Transizione 5.0, lo Stato italiano può coprire fino al 50% dell'investimento in innovazione digitale. Inoltre, l'IA non è un costo: è un investimento che si ripaga attraverso l'efficienza operativa e la riduzione dei compiti manuali ripetitivi.",
            },
            {
              q: "L'Intelligenza Artificiale sostituirà i miei dipendenti?",
              a: "L'IA non sostituisce le persone — le potenzia. Automatizza i compiti ripetitivi (inserimento dati, reportistica, risposte FAQ) liberando il tuo team per attività a maggior valore aggiunto. Le aziende che adottano l'IA registrano un aumento medio del 40% nell'efficienza del personale.",
            },
            {
              q: "Non ho tempo per un progetto tecnologico complesso.",
              a: "Proprio per questo esiste un metodo strutturato in 90 giorni. Non si tratta di una rivoluzione caotica, ma di un percorso graduale: il primo mese si dedica all'organizzazione, il secondo all'automazione, il terzo al controllo. Risultati misurabili, senza stravolgere la tua operatività quotidiana.",
            },
            {
              q: "Come posso fidarmi se non conosco bene la tecnologia?",
              a: "La nostra newsletter è pensata esattamente per questo: tradurre la complessità tecnologica in linguaggio imprenditoriale. Parliamo di marginalità, controllo, flusso di cassa — non di algoritmi e codice. Iscriviti e giudica tu stesso dalla qualità dei contenuti.",
            },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div
                className="py-6"
                style={{
                  borderTop: "1px solid oklch(0.80 0.005 60)",
                }}
              >
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    lineHeight: 1.3,
                  }}
                >
                  {item.q}
                </h3>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.95rem",
                    color: "#555",
                    lineHeight: 1.7,
                  }}
                >
                  {item.a}
                </p>
              </div>
            </FadeIn>
          ))}
          <div style={{ borderTop: "1px solid oklch(0.80 0.005 60)" }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SOCIAL PROOF — Credibility badges */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-16 lg:mt-20" id="fonti" aria-label="Fonti e credibilità">
        <FadeIn>
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10 py-6">
            {[
              "Dati: Politecnico di Milano",
              "Dati: Banca d'Italia",
              "Dati: ISTAT 2025",
              "Incentivi: Transizione 5.0",
            ].map((badge) => (
              <span
                key={badge}
                className="px-4 py-2"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#999",
                  border: "1px solid oklch(0.85 0.005 60)",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* QUOTE — Pull quote section — DYNAMIC */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-16 lg:mt-24" id="citazione" aria-label="Citazione editoriale">
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
              {content.quote}
            </blockquote>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECONDARY CTA — Bottom subscription — DYNAMIC */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container mt-8 lg:mt-16 mb-16" id="cta" aria-label="Invito all'iscrizione">
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
                {content.ctaTitle}
              </h2>
              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "#555",
                  lineHeight: 1.7,
                }}
              >
                {content.ctaText}
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
      <footer className="container pb-8" role="contentinfo" aria-label="Informazioni su Sintesys.io">
        <div className="rule-thin mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src={BRAIN_ICON}
            alt="Sintesys.io — Consulenza Intelligenza Artificiale per PMI italiane"
            className="h-8 w-8 rounded-full"
            loading="lazy"
            width="32"
            height="32"
            style={{ filter: "brightness(0)" }}
          />
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "#999",
            }}
          >
            © {new Date().getFullYear()} Sintesys.io — Tutti i diritti riservati.
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
