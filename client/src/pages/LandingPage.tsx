/**
 * Landing Page — Produto Final (Destino dos Ads)
 * Foco: Geração de lead qualificado com formulário simplificado de 6 campos
 * Estrutura AIDA: Atenção → Interesse → Desejo → Ação
 * Mobile-first, formulário em popup modal (sem redirect)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const BRAIN_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/brain-icon_a74d4c28.png";
const LAMBERTO_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/lamberto-grinover_a1c8f6fb.png";

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

const REVENUE_OPTIONS = [
  "Meno di €500K",
  "€500K – €1M",
  "€1M – €3M",
  "€3M – €5M",
  "€5M – €12M",
  "Oltre €12M",
];

const EMPLOYEE_OPTIONS = [
  "1 – 5",
  "6 – 10",
  "11 – 25",
  "26 – 50",
  "51 – 100",
  "Oltre 100",
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* POPUP MODAL — Formulário 6 campos com sucesso inline  */
/* ═══════════════════════════════════════════════════════ */
function AuditPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    sector: "",
    revenue: "",
    employees: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const mutation = trpc.landingLeads.submit.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSubmitted(true);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.sector || !form.revenue || !form.employees) return;
    mutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      sector: form.sector,
      revenue: form.revenue,
      employees: form.employees,
    });
  };

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "", sector: "", revenue: "", employees: "" });
      mutation.reset();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Block body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const inputStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.875rem",
    color: "#1A1A1A",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: "0.75rem 1rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    paddingRight: "2.5rem",
  };

  const labelStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.7rem",
    fontWeight: 600 as const,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#666",
    marginBottom: "0.375rem",
    display: "block",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: "#FAFAF7",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-colors z-10"
              style={{
                backgroundColor: "rgba(0,0,0,0.05)",
                border: "none",
                cursor: "pointer",
                borderRadius: "50%",
              }}
              aria-label="Chiudi"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="p-6 sm:p-8">
              {submitted ? (
                /* ═══ SUCCESS STATE ═══ */
                <div className="text-center py-6">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                    style={{ backgroundColor: "rgba(27,42,74,0.1)" }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Richiesta Ricevuta!
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "1rem",
                      color: "#555",
                      lineHeight: 1.6,
                      marginBottom: "1.5rem",
                    }}
                  >
                    Lamberto Grinover analizzerà personalmente il suo profilo aziendale e la contatterà entro 24 ore per fissare la sessione strategica di 30 minuti.
                  </p>

                  {/* 3 next steps */}
                  <div className="space-y-3 text-left mb-6">
                    {[
                      { num: "1", text: "Analisi del suo profilo aziendale" },
                      { num: "2", text: "Contatto entro 24 ore" },
                      { num: "3", text: "Sessione strategica di 30 minuti" },
                    ].map((step) => (
                      <div key={step.num} className="flex items-center gap-3">
                        <span
                          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full"
                          style={{
                            backgroundColor: "#1B2A4A",
                            color: "#FAFAF7",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                          }}
                        >
                          {step.num}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "0.95rem",
                            color: "#444",
                          }}
                        >
                          {step.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-3 transition-all duration-300"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      backgroundColor: "transparent",
                      color: "#1B2A4A",
                      border: "2px solid #1B2A4A",
                      cursor: "pointer",
                    }}
                  >
                    Chiudi
                  </button>
                </div>
              ) : (
                /* ═══ FORM STATE ═══ */
                <>
                  <div className="mb-6 pr-8">
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: "#1A1A1A",
                        lineHeight: 1.2,
                        marginBottom: "0.5rem",
                      }}
                    >
                      Prenota la tua Sessione Strategica
                    </h2>
                    <p
                      style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "0.9rem",
                        color: "#666",
                        lineHeight: 1.5,
                      }}
                    >
                      30 minuti con Lamberto Grinover per scoprire dove l'IA può generare impatto concreto nella tua azienda.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label style={labelStyle}>Nome e Cognome *</label>
                        <input
                          type="text"
                          placeholder="Mario Rossi"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Email Aziendale *</label>
                        <input
                          type="email"
                          placeholder="mario@azienda.it"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label style={labelStyle}>Telefono</label>
                        <input
                          type="tel"
                          placeholder="+39 333 123 4567"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Settore *</label>
                        <select
                          value={form.sector}
                          onChange={(e) => setForm({ ...form, sector: e.target.value })}
                          required
                          style={selectStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        >
                          <option value="">Seleziona settore...</option>
                          {SECTORS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label style={labelStyle}>Fatturato Annuo *</label>
                        <select
                          value={form.revenue}
                          onChange={(e) => setForm({ ...form, revenue: e.target.value })}
                          required
                          style={selectStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        >
                          <option value="">Seleziona fatturato...</option>
                          {REVENUE_OPTIONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Numero Dipendenti *</label>
                        <select
                          value={form.employees}
                          onChange={(e) => setForm({ ...form, employees: e.target.value })}
                          required
                          style={selectStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        >
                          <option value="">Seleziona...</option>
                          {EMPLOYEE_OPTIONS.map((emp) => (
                            <option key={emp} value={emp}>{emp}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full py-3.5 transition-all duration-300"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        backgroundColor: "#1B2A4A",
                        color: "#FAFAF7",
                        border: "none",
                        cursor: mutation.isPending ? "wait" : "pointer",
                        opacity: mutation.isPending ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => { if (!mutation.isPending) e.currentTarget.style.backgroundColor = "#0f1d36"; }}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1B2A4A")}
                    >
                      {mutation.isPending ? "Invio in corso..." : "Prenota la Sessione Strategica"}
                    </button>

                    {mutation.isError && (
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#c53030", textAlign: "center" }}>
                        Si è verificato un errore. Riprova.
                      </p>
                    )}

                    <p
                      className="text-center"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.65rem",
                        color: "#999",
                        marginTop: "0.5rem",
                      }}
                    >
                      Solo 30 minuti. Nessun impegno. Strategia concreta per la tua azienda.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* CTA BUTTON — Reusable across sections                 */
/* ═══════════════════════════════════════════════════════ */
function CTAButton({ onClick, large = false }: { onClick: () => void; large?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`transition-all duration-300 ${large ? "py-4 px-10" : "py-3.5 px-8"}`}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: large ? "0.85rem" : "0.8rem",
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        backgroundColor: "#1B2A4A",
        color: "#FAFAF7",
        border: "none",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0f1d36")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1B2A4A")}
    >
      Prenota la Sessione Strategica
    </button>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* MAIN LANDING PAGE                                     */
/* ═══════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const openPopup = useCallback(() => setPopupOpen(true), []);
  const closePopup = useCallback(() => setPopupOpen(false), []);

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* NAVBAR — Minimal, only logo (no buttons to distract)  */}
      {/* ═══════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO — Atenção: Pain point + Foto Lamberto + CTA      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container pt-8 lg:pt-16 pb-12 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Copy */}
          <div className="lg:col-span-7">
            <FadeIn>
              <p
                className="uppercase tracking-[0.15em] mb-3"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  color: "#1B2A4A",
                  fontWeight: 600,
                }}
              >
                Consulenza Strategica IA per PMI Italiane
              </p>
              <h1
                className="mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                  fontWeight: 800,
                  color: "#1A1A1A",
                  lineHeight: 1.1,
                }}
              >
                La tua azienda perde <span style={{ color: "#1B2A4A" }}>3 ore al giorno</span> in processi che l'IA può automatizzare.
              </h1>
              <p
                className="mb-6"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.15rem",
                  color: "#444",
                  lineHeight: 1.7,
                }}
              >
                Il 72% delle PMI italiane sa che deve innovare, ma non sa da dove iniziare. Noi lo sappiamo. In 30 minuti, Lamberto Grinover analizza la tua azienda e ti mostra <strong>esattamente</strong> dove l'Intelligenza Artificiale può tagliare costi, eliminare errori e liberare il tuo team dalle attività ripetitive.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: "✓", text: "Sessione Strategica Personalizzata" },
                  { icon: "✓", text: "Nessun Impegno" },
                  { icon: "✓", text: "Risultati in 30 min" },
                ].map((badge) => (
                  <div
                    key={badge.text}
                    className="flex items-center gap-1.5"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "#1B2A4A",
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                      style={{ backgroundColor: "rgba(27,42,74,0.1)", fontSize: "0.6rem", fontWeight: 700 }}
                    >
                      {badge.icon}
                    </span>
                    {badge.text}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <CTAButton onClick={openPopup} large />
            </FadeIn>
          </div>

          {/* Right: Stats + Social Proof */}
          <div className="lg:col-span-5">
            <FadeIn delay={0.2}>
              <div className="flex flex-col items-center">
                {/* Key stats */}
                <div className="grid grid-cols-3 gap-4 w-full">
                  {[
                    { number: 40, suffix: "%", label: "Efficienza media in più" },
                    { number: 50, suffix: "%", label: "Credito d'imposta disponibile" },
                    { number: 90, suffix: "gg", label: "Per i primi risultati" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                          fontWeight: 800,
                          color: "#1B2A4A",
                          lineHeight: 1,
                        }}
                      >
                        <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                      </div>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.55rem",
                          fontWeight: 500,
                          color: "#888",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginTop: "0.25rem",
                        }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PROBLEMA — Interesse: I 3 problemi che risolviamo     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#1B2A4A" }} className="py-16 lg:py-24">
        <div className="container">
          <FadeIn>
            <p
              className="uppercase tracking-[0.15em] mb-2 text-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                color: "rgba(250,250,247,0.5)",
                fontWeight: 500,
              }}
            >
              I Problemi che Risolviamo
            </p>
            <h2
              className="text-center mb-12"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 700,
                color: "#FAFAF7",
                lineHeight: 1.15,
              }}
            >
              La tua azienda soffre di almeno uno di questi?
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                number: "01",
                title: "Caos Operazionale",
                problem: "Dati sparsi tra Excel, email e WhatsApp. Nessuno ha il quadro completo.",
                solution: "Un sistema IA centralizzato che organizza, analizza e ti dà il controllo totale.",
              },
              {
                number: "02",
                title: "Tempo Bruciato",
                problem: "Il tuo team passa ore su fatturazione, reportistica e inserimento dati manuali.",
                solution: "Automazione intelligente che libera 3+ ore al giorno per attività strategiche.",
              },
              {
                number: "03",
                title: "Margini Compressi",
                problem: "I costi operativi crescono ma i margini no. La concorrenza è più veloce.",
                solution: "IA che riduce errori, ottimizza processi e ti fa risparmiare fino al 30%.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className="p-6 lg:p-8 h-full"
                  style={{
                    backgroundColor: "rgba(250,250,247,0.05)",
                    borderLeft: "3px solid rgba(250,250,247,0.2)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      color: "rgba(250,250,247,0.15)",
                      lineHeight: 1,
                      display: "block",
                      marginBottom: "1rem",
                    }}
                  >
                    {item.number}
                  </span>
                  <h3
                    className="mb-3"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "#FAFAF7",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mb-4"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "0.95rem",
                      color: "rgba(250,250,247,0.6)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.problem}
                  </p>
                  <div
                    className="pt-4"
                    style={{ borderTop: "1px solid rgba(250,250,247,0.1)" }}
                  >
                    <p
                      style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "0.95rem",
                        color: "rgba(250,250,247,0.85)",
                        lineHeight: 1.6,
                        fontWeight: 500,
                      }}
                    >
                      <strong style={{ color: "#FAFAF7" }}>La soluzione:</strong> {item.solution}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PROCESSO — Desejo: Come funziona                      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container py-16 lg:py-24">
        <FadeIn>
          <p
            className="uppercase tracking-[0.15em] mb-2 text-center"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              color: "#1B2A4A",
              fontWeight: 600,
            }}
          >
            Il Metodo
          </p>
          <h2
            className="text-center mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.15,
            }}
          >
            Da caos operazionale a efficienza in 90 giorni.
          </h2>
          <p
            className="text-center max-w-2xl mx-auto mb-12"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.05rem",
              color: "#555",
              lineHeight: 1.7,
            }}
          >
            Un percorso strutturato, senza stravolgere la tua operatività quotidiana.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {[
            {
              step: "Mese 1",
              title: "Audit & Strategia",
              desc: "Analizziamo i tuoi processi, identifichiamo le inefficienze e creiamo un piano d'azione personalizzato con ROI stimato.",
              detail: "Sessione di 30 min + Report dettagliato",
            },
            {
              step: "Mese 2",
              title: "Implementazione",
              desc: "Installiamo e configuriamo le soluzioni IA selezionate, formiamo il tuo team e integriamo con i tuoi strumenti esistenti.",
              detail: "Setup completo + Formazione team",
            },
            {
              step: "Mese 3",
              title: "Ottimizzazione",
              desc: "Monitoriamo i risultati, ottimizziamo le performance e ti consegniamo un sistema autonomo che lavora per te.",
              detail: "Dashboard KPI + Supporto continuo",
            },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div
                className="p-6 lg:p-8 relative"
                style={{
                  borderLeft: i > 0 ? "1px solid oklch(0.85 0.005 60)" : "none",
                }}
              >
                <span
                  className="inline-block px-3 py-1 mb-4"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#1B2A4A",
                    backgroundColor: "rgba(27,42,74,0.08)",
                  }}
                >
                  {item.step}
                </span>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mb-4"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.95rem",
                    color: "#555",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    color: "#1B2A4A",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.detail}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* INCENTIVI — Desejo: Transizione 5.0                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 lg:py-20"
        style={{ backgroundColor: "rgba(27,42,74,0.04)" }}
      >
        <div className="container">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
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
                  Incentivi Fiscali 2025
                </p>
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
                  Lo Stato paga fino al 50% della tua innovazione.
                </h2>
                <p
                  className="mb-4"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "1.05rem",
                    color: "#444",
                    lineHeight: 1.7,
                  }}
                >
                  Il programma <strong>Transizione 5.0</strong> offre crediti d'imposta per la digitalizzazione delle PMI. Con €6,3 miliardi di fondi disponibili e scadenza nel 2025, questo è il momento migliore per investire nell'innovazione della tua azienda.
                </p>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "1.05rem",
                    color: "#444",
                    lineHeight: 1.7,
                  }}
                >
                  <strong>Ti aiutiamo a strutturare il progetto per massimizzare il credito d'imposta</strong> — dalla documentazione alla rendicontazione, tutto incluso nel nostro servizio.
                </p>
              </div>
              <div className="lg:col-span-5">
                <div
                  className="p-6 lg:p-8"
                  style={{ backgroundColor: "#1B2A4A" }}
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
                    Fondi Disponibili
                  </p>
                  <div className="space-y-4">
                    {[
                      { value: "50%", label: "Credito d'imposta massimo" },
                      { value: "€6,3 Mld", label: "Fondi stanziati dal MIMIT" },
                      { value: "2025", label: "Scadenza per accedere ai fondi" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-baseline gap-3">
                        <span
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.5rem",
                            fontWeight: 800,
                            color: "#FAFAF7",
                            minWidth: "5rem",
                          }}
                        >
                          {item.value}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "0.9rem",
                            color: "rgba(250,250,247,0.7)",
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CHI È LAMBERTO — Desejo: Autorità                    */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container py-16 lg:py-24">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-4 flex justify-center">
              <div
                className="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden"
                style={{
                  border: "4px solid #1B2A4A",
                  boxShadow: "0 8px 32px rgba(27,42,74,0.15)",
                }}
              >
                <img
                  src={LAMBERTO_PHOTO}
                  alt="Lamberto Grinover — Fondatore Sintesys.io"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="lg:col-span-8">
              <p
                className="uppercase tracking-[0.15em] mb-2"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  color: "#1B2A4A",
                  fontWeight: 600,
                }}
              >
                Il Tuo Consulente
              </p>
              <h2
                className="mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.15,
                }}
              >
                Lamberto Grinover
              </h2>
              <p
                className="mb-4"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "#444",
                  lineHeight: 1.7,
                }}
              >
                Consulente strategico specializzato nell'implementazione dell'Intelligenza Artificiale per PMI italiane. Con esperienza diretta nel tessuto imprenditoriale italiano, Lamberto traduce la complessità tecnologica in risultati concreti: più efficienza, meno costi, margini migliori.
              </p>
              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "#444",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                "Non parlo di algoritmi. Parlo di marginalità, controllo e flusso di cassa. L'IA è lo strumento, il risultato è il tuo business che funziona meglio."
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FAQ — Objeções                                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 lg:py-20"
        style={{ backgroundColor: "rgba(27,42,74,0.04)" }}
      >
        <div className="container">
          <FadeIn>
            <p
              className="uppercase tracking-[0.15em] mb-2 text-center"
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
              className="text-center mb-10"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#1A1A1A",
                lineHeight: 1.15,
              }}
            >
              Le obiezioni più comuni (e le nostre risposte).
            </h2>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-0">
            {[
              {
                q: "L'IA è troppo costosa per una PMI?",
                a: "No. Con Transizione 5.0, lo Stato copre fino al 50% dell'investimento. Inoltre, l'IA non è un costo: è un investimento che si ripaga attraverso l'efficienza operativa. Le aziende che implementano l'IA vedono un ROI medio del 300% nel primo anno.",
              },
              {
                q: "L'IA sostituirà i miei dipendenti?",
                a: "L'IA non sostituisce le persone — le potenzia. Automatizza i compiti ripetitivi (inserimento dati, reportistica, risposte FAQ) liberando il tuo team per attività a maggior valore. Le aziende che adottano l'IA registrano +40% di efficienza del personale.",
              },
              {
                q: "Non ho tempo per un progetto tecnologico complesso.",
                a: "Proprio per questo il nostro metodo è strutturato in 90 giorni, senza stravolgere la tua operatività. Il primo mese è solo analisi e strategia — zero impatto sulle tue attività quotidiane.",
              },
              {
                q: "Come faccio a fidarmi se non conosco la tecnologia?",
                a: "La sessione strategica serve esattamente a questo: in 30 minuti, Lamberto ti mostra concretamente cosa l'IA può fare per la tua azienda specifica. Nessun gergo tecnico, solo numeri e risultati tangibili.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div
                  className="py-6"
                  style={{ borderTop: "1px solid oklch(0.85 0.005 60)" }}
                >
                  <h3
                    className="mb-3"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.1rem",
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
            <div style={{ borderTop: "1px solid oklch(0.85 0.005 60)" }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CTA FINAL — Ação: Botão que abre popup                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container py-16 lg:py-24">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <div className="rule-thick mb-8" />
            <h2
              className="mb-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 700,
                color: "#1A1A1A",
                lineHeight: 1.15,
              }}
            >
              Pronto a scoprire cosa l'IA può fare per te?
            </h2>
            <p
              className="mb-8"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1.05rem",
                color: "#555",
                lineHeight: 1.7,
              }}
            >
              Compila il modulo e Lamberto Grinover ti contatterà entro 24 ore per una sessione strategica di 30 minuti.
            </p>
            <CTAButton onClick={openPopup} large />
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FOOTER                                                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <footer className="container pb-8" role="contentinfo">
        <div className="rule-thin mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src={BRAIN_ICON}
            alt="Sintesys.io"
            className="h-8 w-8 rounded-full"
            loading="lazy"
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
            <Link
              href="/giornale"
              className="no-underline"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
              }}
            >
              Il Giornale dell'IA
            </Link>
            <Link
              href="/chi-siamo"
              className="no-underline"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
              }}
            >
              Chi Siamo
            </Link>
            <a
              href="https://www.instagram.com/sintesys.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
              }}
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* POPUP MODAL                                           */}
      {/* ═══════════════════════════════════════════════════════ */}
      <AuditPopup isOpen={popupOpen} onClose={closePopup} />
    </div>
  );
}
