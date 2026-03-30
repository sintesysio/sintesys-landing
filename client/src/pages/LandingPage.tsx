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
import { trackFormView, trackLeadQualified, trackCTAClick } from "@/lib/tracking";

const BRAIN_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/brain-icon_a74d4c28.png";
const LAMBERTO_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/lamberto-grinover_a1c8f6fb.png";

const SECTORS = [
  "Indústria e Manufatura",
  "Comércio Atacadista",
  "Comércio Varejista",
  "Serviços Profissionais",
  "Construção Civil",
  "Logística e Transportes",
  "Restauração e Hospitalidade",
  "Tecnologia",
  "Outro",
];

const REVENUE_OPTIONS = [
  "Menos de €500K",
  "€500K – €1M",
  "€1M – €3M",
  "€3M – €5M",
  "€5M – €12M",
  "Acima de €12M",
];

const EMPLOYEE_OPTIONS = [
  "1 – 5",
  "6 – 10",
  "11 – 25",
  "26 – 50",
  "51 – 100",
  "Acima de 100",
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
        trackLeadQualified({
          name: form.name,
          email: form.email,
          sector: form.sector,
          source: "landing_page",
          revenue: form.revenue,
          employees: form.employees,
        });
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
              aria-label="Fechar"
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
                    Solicitação Recebida!
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
                    Lamberto Grinover analisará pessoalmente o perfil da sua empresa e entrará em contato em até 24 horas para agendar a sessão estratégica de 30 minutos.
                  </p>

                  {/* 3 next steps */}
                  <div className="space-y-3 text-left mb-6">
                    {[
                      { num: "1", text: "Análise do perfil da sua empresa" },
                      { num: "2", text: "Contato em até 24 horas" },
                      { num: "3", text: "Sessão estratégica de 30 minutos" },
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
                    Fechar
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
                      Agende Sua Análise Gratuita
                    </h2>
                    <p
                      style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "0.9rem",
                        color: "#666",
                        lineHeight: 1.5,
                      }}
                    >
                      30 minutos com Lamberto Grinover para analisar seus processos e mostrar onde a IA pode gerar impacto concreto.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label style={labelStyle}>Nome Completo *</label>
                        <input
                          type="text"
                          placeholder="João Silva"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Email Corporativo *</label>
                        <input
                          type="email"
                          placeholder="joao@empresa.com"
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
                        <label style={labelStyle}>Telefone</label>
                        <input
                          type="tel"
                          placeholder="+55 11 99999-9999"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Setor *</label>
                        <select
                          value={form.sector}
                          onChange={(e) => setForm({ ...form, sector: e.target.value })}
                          required
                          style={selectStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        >
                          <option value="">Selecione o setor...</option>
                          {SECTORS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label style={labelStyle}>Faturamento Anual *</label>
                        <select
                          value={form.revenue}
                          onChange={(e) => setForm({ ...form, revenue: e.target.value })}
                          required
                          style={selectStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        >
                          <option value="">Selecione o faturamento...</option>
                          {REVENUE_OPTIONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Número de Funcionários *</label>
                        <select
                          value={form.employees}
                          onChange={(e) => setForm({ ...form, employees: e.target.value })}
                          required
                          style={selectStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                        >
                          <option value="">Selecione...</option>
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
                        backgroundColor: "#C4704B",
                        color: "#FAFAF7",
                        border: "none",
                        cursor: mutation.isPending ? "wait" : "pointer",
                        opacity: mutation.isPending ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => { if (!mutation.isPending) e.currentTarget.style.backgroundColor = "#A85A3A"; }}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C4704B")}
                    >
                      {mutation.isPending ? "Enviando..." : "Agende Sua Análise Gratuita →"}
                    </button>

                    {mutation.isError && (
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#c53030", textAlign: "center" }}>
                        Ocorreu um erro. Tente novamente.
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
                      Apenas 30 minutos. Sem compromisso. Estratégia concreta para sua empresa.
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
        backgroundColor: "#C4704B",
        color: "#FAFAF7",
        border: "none",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#A85A3A")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C4704B")}
    >
      Agende Sua Análise Gratuita →
    </button>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* MAIN LANDING PAGE                                     */
/* ═══════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const openPopup = useCallback(() => {
    setPopupOpen(true);
    trackFormView("landing_page_audit_popup");
    trackCTAClick("Prenota Sessione Strategica", "landing_page");
  }, []);
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
                Consultoria Estratégica de IA para PMEs Italianas
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
                Sua empresa queima <span style={{ color: "#C4704B" }}>€47.000 por ano</span> em processos que a IA resolve em horas.
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
                Não é uma promessa — é o dado médio das PMEs italianas com 10-50 funcionários (Osservatorio Politecnico di Milano, 2025). Em uma sessão estratégica de 30 minutos, Lamberto Grinover analisa seus processos e mostra <strong>exatamente</strong> onde cortar custos, eliminar erros e liberar sua equipe.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: "✓", text: "Análise Gratuita e Personalizada" },
                  { icon: "✓", text: "Zero Compromisso, Zero Risco" },
                  { icon: "✓", text: "Plano de Ação Concreto em 48h" },
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
                    { number: 40, suffix: "%", label: "Eficiência média a mais" },
                    { number: 50, suffix: "%", label: "Crédito fiscal disponível" },
                    { number: 90, suffix: "dias", label: "Para os primeiros resultados" },
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
              Os Problemas que Resolvemos
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
              Reconhece pelo menos um destes na sua empresa?
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                number: "01",
                title: "Caos Operacional",
                problem: "Dados espalhados entre 7 planilhas Excel, 3 caixas de email e WhatsApp. Ninguém tem o quadro completo — nem você.",
                solution: "Um sistema de IA que centraliza tudo em um único painel. As empresas que implementam reduzem os erros em 60%.",
              },
              {
                number: "02",
                title: "Tempo Desperdiçado",
                problem: "Sua equipe gasta 3+ horas por dia com faturamento, relatórios e inserção de dados. Horas que não voltam.",
                solution: "Automação inteligente que libera 15+ horas por semana. Custo médio: menos que um salário de meio período.",
              },
              {
                number: "03",
                title: "Margens Comprimidas",
                problem: "O faturamento cresce 5%, mas os custos operacionais crescem 12%. A margem diminui a cada trimestre.",
                solution: "IA que otimiza preços, reduz desperdícios e corta custos operacionais em 20-30%. ROI médio documentado: 300% no primeiro ano.",
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
                      <strong style={{ color: "#FAFAF7" }}>A solução:</strong> {item.solution}
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
            O Método
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
            Da confusão à clareza em 5 passos.
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
            Um percurso estruturado que não desorganiza sua operação.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {[
            {
              step: "Passo 1",
              title: "Sessão Estratégica",
              desc: "Analisamos juntos seus processos e identificamos as 3 áreas onde a IA pode gerar o máximo impacto imediato.",
              detail: "Gratuita · Online ou presencial · 30 min",
            },
            {
              step: "Passo 2",
              title: "Auditoria Operacional",
              desc: "Mapeamos cada processo, medimos as ineficiências e calculamos o ROI potencial de cada automação.",
              detail: "Relatório detalhado com prioridades de intervenção",
            },
            {
              step: "Passo 3",
              title: "Implementação",
              desc: "Instalamos as primeiras automações, treinamos sua equipe e integramos com suas ferramentas existentes.",
              detail: "Primeira automação funcionando garantida",
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
                  Incentivos Fiscais 2025
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
                  O Estado paga até 50% da sua inovação.
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
                  O programa <strong>Transição 5.0</strong> oferece créditos fiscais para a digitalização das PMEs. Com €6,3 bilhões em fundos disponíveis e prazo em 2025, este é o melhor momento para investir na inovação da sua empresa.
                </p>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "1.05rem",
                    color: "#444",
                    lineHeight: 1.7,
                  }}
                >
                  <strong>Ajudamos você a estruturar o projeto para maximizar o crédito fiscal</strong> — da documentação à prestação de contas, tudo incluído no nosso serviço.
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
                    Fundos Disponíveis
                  </p>
                  <div className="space-y-4">
                    {[
                      { value: "50%", label: "Crédito fiscal máximo" },
                      { value: "€6,3 Bi", label: "Fundos alocados pelo MIMIT" },
                      { value: "2025", label: "Prazo para acessar os fundos" },
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
                  alt="Lamberto Grinover — Fundador Sintesys.io"
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
                Seu Consultor
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
                28 anos em cargos de direção na Nissan Itália, Cushman & Wakefield, Tishman Speyer e Brookfield. Geriu operações de €200M+ e equipes de 150+ pessoas. Hoje traduz essa experiência em uma única coisa: fazer sua empresa funcionar melhor com Inteligência Artificial.
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
                "Não vendemos tecnologia. Traduzimos a Inteligência Artificial em margem concreta — com o rigor de quem geriu operações de €200M em quatro multinacionais."
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
              Perguntas Frequentes
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
              As objeções mais comuns (e nossas respostas).
            </h2>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-0">
            {[
              {
                q: "A IA é muito cara para uma PME?",
                a: "Com a Transição 5.0, o Estado cobre até 50% do investimento. Mas o ponto real é outro: a IA não é um custo. É um investimento que se paga em 3-6 meses através da eficiência operacional. As PMEs que implementam IA veem um ROI médio de 300% no primeiro ano (fonte: McKinsey, 2024).",
              },
              {
                q: "A IA vai substituir meus funcionários?",
                a: "Não. A IA automatiza tarefas repetitivas — inserção de dados, faturamento, relatórios, respostas FAQ — e libera sua equipe para atividades que geram valor. As empresas que adotam IA registram +40% de produtividade, não demissões.",
              },
              {
                q: "Não tenho tempo para um projeto tecnológico complexo.",
                a: "Exatamente por isso o primeiro passo é uma sessão de 30 minutos. Zero compromisso, zero complexidade. Se decidir prosseguir, nosso método é estruturado para não desorganizar sua operação diária.",
              },
              {
                q: "Como posso confiar se não entendo de tecnologia?",
                a: "Você não precisa entender — só precisa conhecer seus números. Na sessão estratégica, Lamberto mostra concretamente o que a IA pode fazer pela sua empresa específica. Sem jargão técnico. Só números, processos e resultados tangíveis.",
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
              O próximo passo é seu.
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
              Preencha o formulário. Lamberto analisará pessoalmente seu perfil e entrará em contato em até 24 horas para agendar a sessão estratégica.
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
            © {new Date().getFullYear()} Sintesys.io — Todos os direitos reservados.
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
              O Jornal da IA
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
              Quem Somos
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
