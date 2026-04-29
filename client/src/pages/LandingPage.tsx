/**
 * Site Institucional Il Consigliere — Home Page
 * Focus: Lead capture for newsletter (depth and conversion channel)
 * Estratégia de funil:
 *   1. Instagram → Distribuição mídia paga (topo de funil)
 *   2. Low-tickets → Vendas diretas (/mappa)
 *   3. Newsletter → Canal de profundidade e conversão (Jornal + Site)
 *
 * Design: Editorial newspaper style (Playfair Display, Source Serif 4, Inter)
 * Paleta: Off-white (#FAFAF7), Navy (#1B2A4A), Terracotta (#C4704B)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import SEOHead from "@/components/SEOHead";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import NavBar from "@/components/NavBar";
import { trackLeadSimple, trackFormView, trackCTAClick } from "@/lib/tracking";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/PabMcZkaHOkqxPeO.png";
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/hero-newspaper-X6Nu9ZvEg3XFvxCoNGtAqn.webp";
const LAMBERTO_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/lamberto-grinover_a1c8f6fb.png";


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
/* INLINE NEWSLETTER FORM — same pattern as popup         */
/* ═══════════════════════════════════════════════════════ */
function NewsletterForm({ variant = "light", id = "home" }: { variant?: "light" | "dark"; id?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      trackLeadSimple({ name, email, source: "homepage" });
    },
    onError: (err) => {
      if (err.message.includes("già registrato") || err.message.includes("duplicate")) {
        setSubmitted(true);
        trackLeadSimple({ name, email, source: "homepage" });
      } else {
        setError("Si è verificato un errore. Riprova.");
      }
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (!name.trim() || !email.trim()) {
        setError("Compila tutti i campi obbligatori.");
        return;
      }
      trackCTAClick("Newsletter Iscriviti", `homepage_${id}`);
      submitLead.mutate({
        name: name.trim(),
        email: email.trim(),
        source: "homepage",
      });
    },
    [name, email, submitLead, id]
  );

  const isDark = variant === "dark";
  const inputBorder = isDark ? "rgba(250,250,247,0.2)" : "oklch(0.80 0.005 60)";
  const inputBg = isDark ? "rgba(250,250,247,0.08)" : "#fff";
  const inputColor = isDark ? "#FAFAF7" : "#1A1A1A";
  const labelColor = isDark ? "rgba(250,250,247,0.5)" : "#999";
  const placeholderClass = isDark ? "placeholder-white/30" : "";

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <div
          className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full"
          style={{ backgroundColor: isDark ? "rgba(250,250,247,0.15)" : "#1B2A4A" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#FAFAF7" : "#FAFAF7"} strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: isDark ? "#FAFAF7" : "#1A1A1A",
            marginBottom: "0.5rem",
          }}
        >
          Perfetto. Benvenuto.
        </h3>
        <p
          style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: "0.95rem",
            color: isDark ? "rgba(250,250,247,0.7)" : "#666",
            lineHeight: 1.6,
          }}
        >
          Controlla la tua casella email. Riceverai la Guida Transizione 5.0 e il primo aggiornamento settimanale entro pochi minuti.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Nome */}
      <div>
        <label
          htmlFor={`${id}-name`}
          className="block uppercase tracking-[0.12em] mb-1"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.6rem",
            color: labelColor,
            fontWeight: 500,
          }}
        >
          Nome e Cognome *
        </label>
        <input
          id={`${id}-name`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mario Rossi"
          required
          autoComplete="name"
          className={`w-full px-3 py-2.5 text-sm outline-none transition-colors ${placeholderClass}`}
          style={{
            fontFamily: "'Source Serif 4', serif",
            border: `1px solid ${inputBorder}`,
            backgroundColor: inputBg,
            color: inputColor,
          }}
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor={`${id}-email`}
          className="block uppercase tracking-[0.12em] mb-1"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.6rem",
            color: labelColor,
            fontWeight: 500,
          }}
        >
          Email Aziendale *
        </label>
        <input
          id={`${id}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mario@azienda.it"
          required
          autoComplete="email"
          className={`w-full px-3 py-2.5 text-sm outline-none transition-colors ${placeholderClass}`}
          style={{
            fontFamily: "'Source Serif 4', serif",
            border: `1px solid ${inputBorder}`,
            backgroundColor: inputBg,
            color: inputColor,
          }}
        />
      </div>


      {/* Error */}
      {error && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            color: "#c53030",
          }}
        >
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitLead.isPending}
        className="w-full py-3 text-xs uppercase tracking-[0.15em] transition-all"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          backgroundColor: "#C4704B",
          color: "#FAFAF7",
          border: "none",
          cursor: submitLead.isPending ? "wait" : "pointer",
          opacity: submitLead.isPending ? 0.7 : 1,
        }}
      >
        {submitLead.isPending ? "Invio in corso..." : "Iscriviti alla Newsletter Gratuita →"}
      </button>

      {/* Privacy note */}
      <p
        className="text-center"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6rem",
          color: isDark ? "rgba(250,250,247,0.35)" : "#bbb",
          lineHeight: 1.4,
        }}
      >
        Nessuno spam. Puoi cancellarti in qualsiasi momento.
        <br />I tuoi dati sono trattati secondo la normativa GDPR.
      </p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* MAIN HOME PAGE — INSTITUTIONAL                         */
/* ═══════════════════════════════════════════════════════ */
export default function LandingPage() {
  useEffect(() => {
    trackFormView("homepage_institutional");
  }, []);

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      <SEOHead
        title="Il Consigliere — Intelligenza Artificiale operativa per PMI italiane"
        description="Riduci il caos operativo della tua PMI. Newsletter settimanale gratuita + Guida Transizione 5.0 in omaggio."
        path="/"
        ogTitle="Il Consigliere — Intelligenza Artificiale operativa per PMI italiane"
        ogDescription="Riduci il caos operativo della tua PMI. Newsletter settimanale gratuita + Guida Transizione 5.0 in omaggio."
      />
      <NavBar />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO — Posicionamento Institucional + Newsletter CTA   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container pt-8 lg:pt-16 pb-12 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
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
                L'intelligenza Operativa per la PMI Italiana
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
                L'IA che le multinazionali usano.{" "}
                <span style={{ color: "#C4704B" }}>Adattata per la tua PMI.</span>
              </h1>
              <p
                className="mb-4"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.15rem",
                  color: "#444",
                  lineHeight: 1.7,
                }}
              >
                Il Consigliere traduce l'Intelligenza Artificiale in risultati operativi concreti per le Piccole e Medie Imprese italiane. Niente teoria, niente gergo tecnico — solo strategie misurabili che riducono costi, eliminano sprechi e liberano il tuo tempo.
              </p>
              <p
                className="mb-8"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "#555",
                  lineHeight: 1.7,
                }}
              >
                Ogni settimana, titolari di PMI italiane con 10-50 dipendenti ricevono la nostra newsletter con analisi esclusive, casi studio reali e strategie operative per integrare l'IA nella propria azienda. <strong>Iscriviti gratuitamente.</strong>
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-6">
                {[
                  { icon: "✓", text: "Newsletter Settimanale Gratuita" },
                  { icon: "✓", text: "Guida Transizione 5.0 Inclusa" },
                  { icon: "✓", text: "Cancellazione in Un Click" },
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
            </FadeIn>
          </div>

          {/* Right: Newsletter Form */}
          <div className="lg:col-span-5">
            <FadeIn delay={0.2}>
              <div
                className="p-6 lg:p-8"
                style={{
                  border: "1px solid oklch(0.80 0.005 60)",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  className="w-full mb-4"
                  style={{ borderTop: "3px solid #1B2A4A" }}
                />
                <p
                  className="uppercase tracking-[0.2em] mb-1"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.65rem",
                    color: "#1B2A4A",
                    fontWeight: 600,
                  }}
                >
                  Newsletter Gratuita
                </p>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    lineHeight: 1.25,
                  }}
                >
                  Ricevi ogni settimana strategie IA concrete per la tua PMI.
                </h3>
                <p
                  className="mb-4"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.9rem",
                    color: "#555",
                    lineHeight: 1.5,
                  }}
                >
                  Più la Guida Transizione 5.0 — come accedere ai €6,3 miliardi di fondi MIMIT per la digitalizzazione.
                </p>
                <NewsletterForm variant="light" id="hero" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* IL CONTESTO — I numeri del problema                    */}
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
              Il Contesto Italiano
            </p>
            <h2
              className="text-center mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 700,
                color: "#FAFAF7",
                lineHeight: 1.15,
              }}
            >
              Perché le PMI italiane hanno bisogno di una guida sull'IA.
            </h2>
            <p
              className="text-center max-w-2xl mx-auto mb-12"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1.05rem",
                color: "rgba(250,250,247,0.7)",
                lineHeight: 1.7,
              }}
            >
              L'88% delle PMI italiane vuole innovare, ma solo il 26% ha iniziato. La nostra newsletter colma questo divario — ogni settimana.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { number: 88, suffix: "%", label: "PMI vuole innovare", source: "Politecnico Milano, 2024" },
              { number: 26, suffix: "%", label: "Ha iniziato davvero", source: "Politecnico Milano, 2024" },
              { number: 50, suffix: "%", label: "Credito d'imposta disponibile", source: "MIMIT Transizione 5.0" },
              { number: 40, suffix: "%", label: "Efficienza media in più", source: "McKinsey, 2024" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                      fontWeight: 800,
                      color: "#FAFAF7",
                      lineHeight: 1,
                    }}
                  >
                    <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                  </div>
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      color: "rgba(250,250,247,0.7)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="mt-1"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.55rem",
                      color: "rgba(250,250,247,0.35)",
                    }}
                  >
                    {stat.source}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* COSA FACCIAMO — 3 pilastri                             */}
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
            Cosa Facciamo
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
            Tre modi per portare l'IA nella tua azienda.
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
            Dalla conoscenza all'azione — scegli il percorso più adatto alla tua fase.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {[
            {
              step: "01",
              title: "Informati",
              subtitle: "Newsletter + Il Giornale dell'IA",
              desc: "Ogni settimana ricevi analisi, casi studio e strategie operative per capire come l'IA può trasformare la tua PMI. Gratuito, concreto, senza gergo tecnico.",
              cta: "Iscriviti alla Newsletter",
              href: "#newsletter",
              isScroll: true,
            },
            {
              step: "02",
              title: "Mappa",
              subtitle: "Mappa delle Opportunità IA — €95,50",
              desc: "Un foglio Excel con 80 processi analizzati, 8 reparti mappati e una dashboard automatica che ti mostra esattamente dove l'IA può liberare ore e ridurre costi.",
              cta: "Scopri la Mappa",
              href: "/mappa",
              isScroll: false,
            },
            {
              step: "03",
              title: "Agisci",
              subtitle: "Audit Operativo Personalizzato",
              desc: "Lamberto Grinover analizza i tuoi processi in una sessione strategica e costruisce un piano d'azione su misura per la tua azienda. Il primo passo verso l'implementazione.",
              cta: "Parli con Lamberto",
              href: "/contattaci",
              isScroll: false,
            },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div
                className="p-6 lg:p-8 h-full flex flex-col"
                style={{
                  borderLeft: i > 0 ? "1px solid oklch(0.85 0.005 60)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: "rgba(27,42,74,0.1)",
                    lineHeight: 1,
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.step}
                </span>
                <h3
                  className="mb-1"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mb-3"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    color: "#C4704B",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.subtitle}
                </p>
                <p
                  className="mb-6 flex-1"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.95rem",
                    color: "#555",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
                {item.isScroll ? (
                  <a
                    href={item.href}
                    className="inline-block text-center py-2.5 px-5 text-xs uppercase tracking-[0.12em] transition-all no-underline"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      border: "2px solid #1B2A4A",
                      color: "#1B2A4A",
                      backgroundColor: "transparent",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" });
                      trackCTAClick("Newsletter Scroll", "homepage_pillar");
                    }}
                  >
                    {item.cta} &rarr;
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="inline-block text-center py-2.5 px-5 text-xs uppercase tracking-[0.12em] transition-all no-underline"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      border: "2px solid #1B2A4A",
                      color: "#1B2A4A",
                      backgroundColor: "transparent",
                    }}
                    onClick={() => trackCTAClick(item.cta, "homepage_pillar")}
                  >
                    {item.cta} &rarr;
                  </Link>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* IL GIORNALE DELL'IA — Preview + Link                   */}
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
                  Il Nostro Editoriale
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
                  Il Giornale dell'IA
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
                  Ogni settimana pubblichiamo un'edizione del nostro giornale digitale con analisi approfondite su come l'Intelligenza Artificiale sta trasformando il tessuto imprenditoriale italiano. Casi studio reali, strategie operative e aggiornamenti sugli incentivi fiscali — tutto scritto per chi gestisce un'azienda, non per chi programma software.
                </p>
                <p
                  className="mb-6"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "1.05rem",
                    color: "#444",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                  }}
                >
                  "Nessuna formula magica. Solo strategia pura, da imprenditore a imprenditore."
                </p>
                <Link
                  href="/giornale"
                  className="inline-block py-3 px-8 text-xs uppercase tracking-[0.15em] transition-all no-underline"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    backgroundColor: "#1B2A4A",
                    color: "#FAFAF7",
                    border: "none",
                  }}
                  onClick={() => trackCTAClick("Leggi Il Giornale", "homepage_giornale")}
                >
                  Leggi l'Ultima Edizione &rarr;
                </Link>
              </div>
              <div className="lg:col-span-5">
                <Link href="/giornale" className="block">
                  <img
                    src={HERO_IMG}
                    alt="Il Giornale dell'IA — Editoriale settimanale per PMI italiane"
                    className="w-full"
                    loading="lazy"
                    style={{ filter: "grayscale(10%)" }}
                  />
                  <p
                    className="mt-2 italic text-center"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "0.8rem",
                      color: "#888",
                    }}
                  >
                    L'ultima edizione del Giornale dell'IA
                  </p>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TRANSIZIONE 5.0 — Incentivi Fiscali                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container py-16 lg:py-24">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
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
                Il programma <strong>Transizione 5.0</strong> offre crediti d'imposta per la digitalizzazione delle PMI. Con €6,3 miliardi di fondi disponibili, questo è il momento migliore per investire nell'innovazione della tua azienda.
              </p>
              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "#444",
                  lineHeight: 1.7,
                }}
              >
                Nella nostra newsletter analizziamo ogni settimana come accedere a questi fondi, quali requisiti servono e come strutturare il tuo investimento per massimizzare il ritorno. <strong>Iscriviti per non perdere gli aggiornamenti.</strong>
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CHI È LAMBERTO — Fondatore                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 lg:py-20"
        style={{ backgroundColor: "rgba(27,42,74,0.04)" }}
      >
        <div className="container">
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
                    alt="Lamberto Grinover — Fondatore Il Consigliere"
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
                  Il Fondatore
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
                  28 anni in ruoli direttivi presso Nissan Italia, Cushman &amp; Wakefield, Tishman Speyer e Brookfield — gestendo operazioni da oltre €200M. Oggi porta quella stessa disciplina operativa alle PMI italiane, traducendo l'Intelligenza Artificiale in marginalità concreta.
                </p>
                <p
                  className="mb-4"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "1.05rem",
                    color: "#444",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                  }}
                >
                  "Non vendiamo tecnologia. Traduciamo l'Intelligenza Artificiale in marginalità concreta — con il rigore di chi ha gestito operazioni da €200M in quattro multinazionali."
                </p>
                <Link
                  href="/chi-siamo"
                  className="inline-block py-2.5 px-6 text-xs uppercase tracking-[0.12em] transition-all no-underline"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    border: "2px solid #1B2A4A",
                    color: "#1B2A4A",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => trackCTAClick("Chi Siamo", "homepage_lamberto")}
                >
                  Scopri di più &rarr;
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FAQ — Domande Frequenti                                */}
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
            Quello che ci chiedono più spesso.
          </h2>
        </FadeIn>

        <div className="max-w-3xl mx-auto space-y-0">
          {[
            {
              q: "Cos'è Il Consigliere?",
              a: "Il Consigliere è una società di consulenza strategica specializzata nell'integrazione dell'Intelligenza Artificiale nelle Piccole e Medie Imprese italiane. Fondata da Lamberto Grinover, traduce la complessità tecnologica in risultati operativi misurabili: riduzione costi, efficienza e marginalità.",
            },
            {
              q: "La newsletter è davvero gratuita?",
              a: "Sì, completamente gratuita. Riceverai un'edizione settimanale con analisi, casi studio e strategie operative per la tua PMI. Puoi cancellarti in qualsiasi momento con un click. Nessun vincolo, nessun costo nascosto.",
            },
            {
              q: "L'IA è troppo costosa per una PMI?",
              a: "Con Transizione 5.0, lo Stato copre fino al 50% dell'investimento. Ma il punto vero è un altro: l'IA non è un costo. È un investimento che si ripaga in 3-6 mesi attraverso l'efficienza operativa. Le PMI che implementano l'IA vedono un ROI medio del 300% nel primo anno (fonte: McKinsey, 2024).",
            },
            {
              q: "Non capisco nulla di tecnologia. La newsletter fa per me?",
              a: "Assolutamente sì. Scriviamo per imprenditori, non per programmatori. Parliamo di marginalità, controllo, flusso di cassa — non di algoritmi e codice. Se gestisci un'azienda con 10-50 dipendenti, è pensata esattamente per te.",
            },
            {
              q: "Cosa ricevo iscrivendomi?",
              a: "Immediatamente ricevi la Guida Transizione 5.0 — un documento che spiega come accedere ai €6,3 miliardi di fondi MIMIT per la digitalizzazione. Poi, ogni settimana, un'edizione del Giornale dell'IA con analisi esclusive per il tuo settore.",
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
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* NEWSLETTER CTA FINAL — Formulário inline               */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        id="newsletter"
        style={{ backgroundColor: "#1B2A4A" }}
        className="py-16 lg:py-24"
      >
        <div className="container">
          <FadeIn>
            <div className="max-w-xl mx-auto text-center">
              <div
                className="w-full mb-6 mx-auto max-w-xs"
                style={{ borderTop: "3px solid rgba(250,250,247,0.3)" }}
              />
              <h2
                className="mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                  color: "#FAFAF7",
                  lineHeight: 1.15,
                }}
              >
                Resta informato. Resta competitivo.
              </h2>
              <p
                className="mb-8"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "rgba(250,250,247,0.7)",
                  lineHeight: 1.7,
                }}
              >
                Iscriviti alla newsletter di Il Consigliere e ricevi ogni settimana strategie IA concrete per la tua PMI. Più la Guida Transizione 5.0 in omaggio.
              </p>
              <NewsletterForm variant="dark" id="footer-cta" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FOOTER                                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <footer className="container py-8" role="contentinfo">
        <div className="rule-thin mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <img
              src={LOGO_ICON}
              alt="Il Consigliere"
              className="h-8 w-8 rounded-full"
              loading="lazy"
              style={{ filter: "brightness(0)" }}
            />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Il Consigliere
            </span>
          </Link>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "#999",
            }}
          >
            &copy; {new Date().getFullYear()} Il Consigliere &mdash; Tutti i diritti riservati.
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
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
            <Link
              href="/mappa"
              className="no-underline"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
              }}
            >
              Mappa IA
            </Link>
            <a
              href="https://www.instagram.com/ilconsigliere.io/"
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
            <Link
              href="/privacy-policy"
              className="no-underline"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="no-underline"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
              }}
            >
              Termini di Servizio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
