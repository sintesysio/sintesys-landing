/**
 * Lead Capture Page — /lead
 * Página dedicada de captura de lead com formulário completo:
 * Nome, Email, Telefone, Setor (pergunta de qualificação)
 * Integra com leads.submit (Mailchimp tag "lead" + setor, Notion, notificação)
 */

import { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import SEOHead from "@/components/SEOHead";
import { trackLeadSimple, trackCTAClick, trackPageView } from "@/lib/tracking";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";

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

export default function LeadCapturePage() {
  const [, navigate] = useLocation();
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
    onSuccess: (data) => {
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

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      <SEOHead
        title="Scopri come l'IA può trasformare la tua PMI | Il Consigliere"
        description="Lascia i tuoi dati e ricevi gratuitamente la Guida Transizione 5.0 con le opportunità di incentivo per la tua azienda."
        path="/lead"
      />

      {/* Minimal Navbar */}
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

      {/* Main Content */}
      <section className="container py-12 lg:py-20">
        <div className="max-w-xl mx-auto">
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Headline */}
              <h1
                className="text-center mb-3"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                  fontWeight: 800,
                  color: "#1A1A1A",
                  lineHeight: 1.15,
                }}
              >
                L'IA può far crescere la tua azienda.
                <br />
                <span style={{ color: "#C4704B" }}>Scopri come.</span>
              </h1>

              {/* Subheadline */}
              <p
                className="text-center mb-8"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "#555",
                  lineHeight: 1.7,
                  maxWidth: "440px",
                  margin: "0 auto",
                }}
              >
                Compila il modulo e ricevi gratuitamente la <strong>Guida Transizione 5.0</strong> — con le opportunità di incentivo e le strategie IA per la tua PMI.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                  <label
                    htmlFor="lead-name"
                    className="block uppercase tracking-[0.12em] mb-1.5"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.65rem",
                      color: "#999",
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
                    className="w-full px-4 py-3 text-sm outline-none transition-colors"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      border: "1px solid oklch(0.80 0.005 60)",
                      backgroundColor: "#fff",
                      color: "#1A1A1A",
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
                      fontSize: "0.65rem",
                      color: "#999",
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
                    className="w-full px-4 py-3 text-sm outline-none transition-colors"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      border: "1px solid oklch(0.80 0.005 60)",
                      backgroundColor: "#fff",
                      color: "#1A1A1A",
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
                      fontSize: "0.65rem",
                      color: "#999",
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
                    className="w-full px-4 py-3 text-sm outline-none transition-colors"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      border: "1px solid oklch(0.80 0.005 60)",
                      backgroundColor: "#fff",
                      color: "#1A1A1A",
                    }}
                  />
                </div>

                {/* Settore (Qualificação) */}
                <div>
                  <label
                    htmlFor="lead-sector"
                    className="block uppercase tracking-[0.12em] mb-1.5"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.65rem",
                      color: "#999",
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
                      border: "1px solid oklch(0.80 0.005 60)",
                      backgroundColor: "#fff",
                      color: sector ? "#1A1A1A" : "#999",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                    }}
                  >
                    <option value="" disabled>Seleziona il tuo settore...</option>
                    {SECTORS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
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
                  className="w-full py-3.5 text-xs uppercase tracking-[0.15em] transition-all rounded-sm"
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
                  className="text-center pt-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.6rem",
                    color: "#bbb",
                    lineHeight: 1.5,
                  }}
                >
                  Nessuno spam. Puoi cancellarti in qualsiasi momento.
                  <br />
                  I tuoi dati sono trattati secondo la{" "}
                  <Link href="/privacy-policy" className="underline" style={{ color: "#999" }}>
                    normativa GDPR
                  </Link>.
                </p>
              </form>

              {/* Trust badges */}
              <div className="mt-8 pt-6" style={{ borderTop: "1px solid oklch(0.90 0.005 60)" }}>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <TrustBadge icon="🔒" text="Dati protetti" />
                  <TrustBadge icon="📧" text="Zero spam" />
                  <TrustBadge icon="🇮🇹" text="Per PMI italiane" />
                  <TrustBadge icon="⚡" text="Guida immediata" />
                </div>
              </div>
            </motion.div>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center py-8"
            >
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                style={{ backgroundColor: "#1B2A4A" }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FAFAF7" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>

              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: "#1A1A1A",
                  marginBottom: "0.75rem",
                }}
              >
                Perfetto. Benvenuto.
              </h2>

              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "#555",
                  lineHeight: 1.7,
                  maxWidth: "400px",
                  margin: "0 auto 1.5rem",
                }}
              >
                Controlla la tua casella email: riceverai la <strong>Guida Transizione 5.0</strong> entro pochi minuti. Controlla anche lo spam.
              </p>

              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "0.95rem",
                  color: "#777",
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
                  backgroundColor: "#1B2A4A",
                  color: "#FAFAF7",
                }}
              >
                Leggi Il Giornale dell'IA →
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="container pb-8">
        <div className="rule-thin mb-4" />
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

/* ─── Trust Badge Component ─── */
function TrustBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ fontSize: "0.9rem" }}>{icon}</span>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.7rem",
          fontWeight: 500,
          color: "#777",
          letterSpacing: "0.02em",
        }}
      >
        {text}
      </span>
    </div>
  );
}
