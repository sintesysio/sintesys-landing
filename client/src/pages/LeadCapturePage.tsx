/**
 * Lead Capture Page — /lead
 * Landing page completa de captura de lead com:
 * - Headline forte + subheadline com promessa
 * - Apresentação do Lamberto Grinover
 * - Benefícios da transformação IA para PMI
 * - Prova social (dados reais)
 * - Formulário: Nome, Email, Telefone, Setor
 * Integra com leads.submit (Mailchimp tag "lead" + setor, Notion, notificação)
 */

import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { trpc } from "@/lib/trpc";
import SEOHead from "@/components/SEOHead";
import { trackLeadSimple, trackCTAClick, trackPageView } from "@/lib/tracking";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";
const LAMBERTO_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/lamberto-grinover-photo-2iXHYLFE7k2Rj3VPkJLCxE.webp";

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

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LeadCapturePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    trackPageView("/lead");
  }, []);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      trackLeadSimple({ name, email, source: "lead_page", sector });
    },
    onError: (err) => {
      if (err.message.includes("già registrato") || err.message.includes("duplicate")) {
        setSubmitted(true);
        trackLeadSimple({ name, email, source: "lead_page", sector });
      } else {
        setError("Si è verificato un errore. Riprova tra qualche istante.");
      }
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (!name.trim() || !email.trim() || !phone.trim() || !sector) {
        setError("Compila tutti i campi per continuare.");
        return;
      }
      trackCTAClick("Lead Form Submit", "lead_page");
      submitLead.mutate({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        sector,
        source: "lead_page",
      });
    },
    [name, email, phone, sector, submitLead]
  );

  const scrollToForm = () => {
    document.getElementById("lead-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      <SEOHead
        title="Trasforma la tua PMI con l'Intelligenza Artificiale | Il Consigliere"
        description="Scopri come l'IA può ridurre i costi, aumentare la produttività e far crescere la tua azienda. Guida gratuita + consulenza strategica con Lamberto Grinover."
        path="/lead"
      />

      {/* ═══ MINIMAL NAVBAR ═══ */}
      <nav className="container" style={{ backgroundColor: "#FAFAF7" }}>
        <div style={{ height: "3px", backgroundColor: "#1B2A4A" }} />
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
        <div style={{ height: "1px", backgroundColor: "oklch(0.85 0.005 60)" }} />
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="container py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            {/* Kicker */}
            <p
              className="text-center uppercase tracking-[0.2em] mb-4"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#C4704B",
                fontWeight: 600,
              }}
            >
              Per titolari di PMI italiane con 10–50 dipendenti
            </p>

            {/* Headline */}
            <h1
              className="text-center mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 5vw, 3rem)",
                fontWeight: 800,
                color: "#1A1A1A",
                lineHeight: 1.12,
              }}
            >
              La tua azienda merita di più.
              <br />
              <span style={{ color: "#C4704B" }}>L'IA è il tuo vantaggio competitivo.</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-center mb-8 mx-auto"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                color: "#444",
                lineHeight: 1.7,
                maxWidth: "600px",
              }}
            >
              Mentre i tuoi concorrenti perdono <strong>270 ore all'anno</strong> in attività ripetitive, 
              le PMI che usano l'IA stanno già risparmiando tempo, riducendo costi e 
              conquistando nuovi clienti. Scopri come fare lo stesso — senza bisogno di un team tecnico.
            </p>

            {/* CTA Button */}
            <div className="text-center mb-6">
              <button
                onClick={scrollToForm}
                className="px-8 py-4 text-xs uppercase tracking-[0.15em] transition-all"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  backgroundColor: "#C4704B",
                  color: "#FAFAF7",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Ricevi la Guida Gratuita →
              </button>
            </div>

            {/* Micro-proof */}
            <p
              className="text-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
              }}
            >
              Gratuito · Nessun impegno · Risultati in 5 minuti di lettura
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ PROBLEM / PAIN SECTION ═══ */}
      <section style={{ backgroundColor: "#1B2A4A" }} className="py-12 lg:py-16">
        <div className="container max-w-4xl mx-auto">
          <FadeIn>
            <h2
              className="text-center mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                fontWeight: 700,
                color: "#FAFAF7",
                lineHeight: 1.2,
              }}
            >
              Il paradosso delle PMI italiane nel 2026.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard number="88%" label="vuole innovare" desc="degli imprenditori italiani dichiara di voler innovare" source="Politecnico di Milano" />
              <StatCard number="26%" label="agisce davvero" desc="ha implementato soluzioni digitali strutturate" source="Politecnico di Milano" />
              <StatCard number="79%" label="già usa l'IA" desc="delle PMI nel mondo usa l'IA in qualche forma" source="OpenAI/Opinium 2025" />
            </div>

            <p
              className="text-center mx-auto"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1.05rem",
                color: "rgba(250,250,247,0.75)",
                lineHeight: 1.7,
                maxWidth: "550px",
              }}
            >
              La differenza tra chi cresce e chi resta indietro non è il budget. 
              È avere una <strong style={{ color: "#C9A96E" }}>strategia chiara</strong> e qualcuno che ti guidi passo dopo passo.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ LAMBERTO SECTION ═══ */}
      <section className="container py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              {/* Photo */}
              <div className="md:col-span-2 flex justify-center">
                <div
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden"
                  style={{ border: "3px solid #1B2A4A" }}
                >
                  <img
                    src={LAMBERTO_PHOTO}
                    alt="Lamberto Grinover — Consulente IA per PMI"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-3">
                <p
                  className="uppercase tracking-[0.15em] mb-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.65rem",
                    color: "#C4704B",
                    fontWeight: 600,
                  }}
                >
                  Il tuo consulente strategico
                </p>
                <h2
                  className="mb-3"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    lineHeight: 1.2,
                  }}
                >
                  Lamberto Grinover
                </h2>
                <p
                  className="mb-3"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "1rem",
                    color: "#444",
                    lineHeight: 1.7,
                  }}
                >
                  Imprenditore e consulente specializzato nella trasformazione digitale delle PMI italiane. 
                  Con oltre 15 anni di esperienza nella gestione aziendale e nell'innovazione tecnologica, 
                  Lamberto ha aiutato decine di imprese a integrare l'Intelligenza Artificiale nei processi 
                  operativi — riducendo costi, eliminando sprechi e liberando tempo per ciò che conta davvero.
                </p>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.95rem",
                    color: "#666",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                  }}
                >
                  "Non ti serve un team di ingegneri. Ti serve una strategia chiara, 
                  adattata alla realtà della tua azienda. Quello è il mio lavoro."
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ TRANSFORMATION / BENEFITS ═══ */}
      <section style={{ backgroundColor: "#F5F5F0" }} className="py-12 lg:py-16">
        <div className="container max-w-4xl mx-auto">
          <FadeIn>
            <h2
              className="text-center mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)",
                fontWeight: 700,
                color: "#1A1A1A",
                lineHeight: 1.2,
              }}
            >
              Cosa ricevi — gratuitamente.
            </h2>
            <p
              className="text-center mb-10 mx-auto"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1rem",
                color: "#666",
                lineHeight: 1.6,
                maxWidth: "480px",
              }}
            >
              Lascia i tuoi dati e ricevi immediatamente nella tua casella email:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BenefitCard
                icon="📘"
                title="Guida Transizione 5.0"
                desc="Come accedere ai fondi MIMIT per la digitalizzazione. Lo Stato paga fino al 45% del tuo investimento in IA."
              />
              <BenefitCard
                icon="📊"
                title="Newsletter Strategica Settimanale"
                desc="Ogni settimana, dati, casi studio e strategie IA concrete per la tua PMI. Zero gergo tecnico."
              />
              <BenefitCard
                icon="🗺️"
                title="Mappa delle Opportunità IA"
                desc="Scopri reparto per reparto dove l'IA può farti risparmiare tempo e ridurre i costi operativi."
              />
              <BenefitCard
                icon="📞"
                title="Accesso Prioritario"
                desc="Possibilità di prenotare una call strategica gratuita di 30 minuti con Lamberto Grinover."
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="container py-10 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <ProofBadge label="Dati da" source="Politecnico di Milano" />
              <ProofBadge label="Report" source="OpenAI / Opinium" />
              <ProofBadge label="Incentivi" source="MIMIT – Transizione 5.0" />
              <ProofBadge label="Statistiche" source="Banca d'Italia" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FORM SECTION ═══ */}
      <section id="lead-form-section" className="py-12 lg:py-16" style={{ backgroundColor: "#1B2A4A" }}>
        <div className="container max-w-lg mx-auto">
          {!submitted ? (
            <FadeIn>
              <h2
                className="text-center mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)",
                  fontWeight: 700,
                  color: "#FAFAF7",
                  lineHeight: 1.2,
                }}
              >
                Inizia la trasformazione.
              </h2>
              <p
                className="text-center mb-8"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "0.95rem",
                  color: "rgba(250,250,247,0.7)",
                  lineHeight: 1.6,
                }}
              >
                Compila il modulo e ricevi la Guida Transizione 5.0 nella tua email entro 2 minuti.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                  <label
                    htmlFor="lead-name"
                    className="block uppercase tracking-[0.12em] mb-1.5"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.6rem",
                      color: "rgba(250,250,247,0.5)",
                      fontWeight: 500,
                    }}
                  >
                    Nome e Cognome *
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mario Rossi"
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 text-sm outline-none transition-colors placeholder-white/30"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      border: "1px solid rgba(250,250,247,0.2)",
                      backgroundColor: "rgba(250,250,247,0.08)",
                      color: "#FAFAF7",
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="lead-email"
                    className="block uppercase tracking-[0.12em] mb-1.5"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.6rem",
                      color: "rgba(250,250,247,0.5)",
                      fontWeight: 500,
                    }}
                  >
                    Email Aziendale *
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mario@azienda.it"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 text-sm outline-none transition-colors placeholder-white/30"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      border: "1px solid rgba(250,250,247,0.2)",
                      backgroundColor: "rgba(250,250,247,0.08)",
                      color: "#FAFAF7",
                    }}
                  />
                </div>

                {/* Telefono */}
                <div>
                  <label
                    htmlFor="lead-phone"
                    className="block uppercase tracking-[0.12em] mb-1.5"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.6rem",
                      color: "rgba(250,250,247,0.5)",
                      fontWeight: 500,
                    }}
                  >
                    Telefono *
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+39 333 123 4567"
                    required
                    autoComplete="tel"
                    className="w-full px-4 py-3 text-sm outline-none transition-colors placeholder-white/30"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      border: "1px solid rgba(250,250,247,0.2)",
                      backgroundColor: "rgba(250,250,247,0.08)",
                      color: "#FAFAF7",
                    }}
                  />
                </div>

                {/* Settore */}
                <div>
                  <label
                    htmlFor="lead-sector"
                    className="block uppercase tracking-[0.12em] mb-1.5"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.6rem",
                      color: "rgba(250,250,247,0.5)",
                      fontWeight: 500,
                    }}
                  >
                    In quale settore operi? *
                  </label>
                  <select
                    id="lead-sector"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-sm outline-none transition-colors appearance-none"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      border: "1px solid rgba(250,250,247,0.2)",
                      backgroundColor: "rgba(250,250,247,0.08)",
                      color: sector ? "#FAFAF7" : "rgba(250,250,247,0.35)",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(250,250,247,0.5)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                    }}
                  >
                    <option value="" disabled>Seleziona il tuo settore...</option>
                    {SECTORS.map((s) => (
                      <option key={s} value={s} style={{ color: "#1A1A1A" }}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Error */}
                {error && (
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#f87171",
                    }}
                  >
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitLead.isPending}
                  className="w-full py-3.5 text-xs uppercase tracking-[0.15em] transition-all"
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
                  {submitLead.isPending ? "Invio in corso..." : "Ricevi la Guida Gratuita →"}
                </button>

                {/* Privacy */}
                <p
                  className="text-center pt-1"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.6rem",
                    color: "rgba(250,250,247,0.35)",
                    lineHeight: 1.5,
                  }}
                >
                  Nessuno spam. Puoi cancellarti in qualsiasi momento.
                  <br />
                  I tuoi dati sono trattati secondo la{" "}
                  <Link href="/privacy-policy" className="underline" style={{ color: "rgba(250,250,247,0.5)" }}>
                    normativa GDPR
                  </Link>.
                </p>
              </form>
            </FadeIn>
          ) : (
            /* ═══ SUCCESS STATE ═══ */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center py-8"
            >
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                style={{ backgroundColor: "rgba(250,250,247,0.1)", border: "2px solid #C9A96E" }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>

              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: "#FAFAF7",
                  marginBottom: "0.75rem",
                }}
              >
                Perfetto. Benvenuto.
              </h2>

              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "rgba(250,250,247,0.8)",
                  lineHeight: 1.7,
                  maxWidth: "400px",
                  margin: "0 auto 1.5rem",
                }}
              >
                Controlla la tua casella email: riceverai la <strong style={{ color: "#C9A96E" }}>Guida Transizione 5.0</strong> entro pochi minuti. Controlla anche lo spam.
              </p>

              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "0.95rem",
                  color: "rgba(250,250,247,0.6)",
                  lineHeight: 1.6,
                  maxWidth: "380px",
                  margin: "0 auto 2rem",
                }}
              >
                Nel frattempo, scopri come l'IA sta trasformando le PMI italiane nel nostro giornale quotidiano.
              </p>

              <Link
                href="/giornale"
                className="inline-block px-6 py-3 text-xs uppercase tracking-[0.15em] no-underline transition-all"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  backgroundColor: "#C4704B",
                  color: "#FAFAF7",
                }}
              >
                Leggi Il Giornale dell'IA →
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ URGENCY / CLOSING ═══ */}
      {!submitted && (
        <section className="container py-10 lg:py-12">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                  fontWeight: 600,
                  color: "#1A1A1A",
                  lineHeight: 1.4,
                  fontStyle: "italic",
                }}
              >
                "Ogni mese che aspetti, i tuoi concorrenti guadagnano un vantaggio che diventa sempre più difficile da recuperare."
              </p>
              <p
                className="mt-3"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.75rem",
                  color: "#999",
                }}
              >
                — Lamberto Grinover, Il Consigliere
              </p>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer className="container pb-8">
        <div style={{ height: "1px", backgroundColor: "oklch(0.85 0.005 60)" }} className="mb-4" />
        <p
          className="text-center"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            color: "#999",
          }}
        >
          © {new Date().getFullYear()} Il Consigliere · Sintesys.io ·{" "}
          <Link href="/privacy-policy" className="underline" style={{ color: "#999" }}>
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}

/* ─── Stat Card Component ─── */
function StatCard({ number, label, desc, source }: { number: string; label: string; desc: string; source: string }) {
  return (
    <div className="text-center p-5" style={{ backgroundColor: "rgba(250,250,247,0.05)", border: "1px solid rgba(250,250,247,0.1)" }}>
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2.2rem",
          fontWeight: 800,
          color: "#C9A96E",
          lineHeight: 1,
          marginBottom: "0.25rem",
        }}
      >
        {number}
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "#FAFAF7",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: "0.8rem",
          color: "rgba(250,250,247,0.6)",
          lineHeight: 1.4,
          marginBottom: "0.25rem",
        }}
      >
        {desc}
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.55rem",
          color: "rgba(250,250,247,0.35)",
        }}
      >
        Fonte: {source}
      </p>
    </div>
  );
}

/* ─── Benefit Card Component ─── */
function BenefitCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-5" style={{ backgroundColor: "#fff", border: "1px solid oklch(0.90 0.005 60)" }}>
      <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.5rem" }}>{icon}</span>
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "#1A1A1A",
          marginBottom: "0.4rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: "0.85rem",
          color: "#666",
          lineHeight: 1.5,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

/* ─── Proof Badge Component ─── */
function ProofBadge({ label, source }: { label: string; source: string }) {
  return (
    <div className="text-center">
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6rem",
          color: "#999",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "0.15rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: "0.8rem",
          color: "#1A1A1A",
          fontWeight: 600,
        }}
      >
        {source}
      </p>
    </div>
  );
}
