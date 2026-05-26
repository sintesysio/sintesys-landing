/**
 * /lead — Página de Captura de Lead (v3 — Diagnóstico 8 pontos)
 * 
 * Correções aplicadas:
 * 1. Superlabel → qualificador de audiência PMI (não "esclusivo per iscritti")
 * 2. Headline → ativa dor/urgência (concorrentes já usam IA)
 * 3. Prova social → "80 processi analizzati, 8 reparti" visível no corpo
 * 4. Badge Newsletter → benefício concreto ("1 caso pratico a settimana")
 * 5. Hierarquia → Mappa = herói, Guida = bônus
 * 6. CTA → verbo de ação própria ("Scopri dove stai perdendo tempo →")
 * 7. Dado forte → "80 processi" no H1/subheadline
 * 8. Lamberto → foto + credibilidade
 */

import { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { trackLeadSimple, trackFormView, trackCTAClick } from "@/lib/tracking";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";
const LAMBERTO_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/lamberto-grinover-v2-Tq2cPBpFxRYWbxN7zLnJBi.webp";

const SECTORS = [
  "Manifattura e produzione",
  "Commercio all'ingrosso o al dettaglio",
  "Servizi professionali",
  "Costruzioni e impiantistica",
  "Ristorazione e hospitality",
  "Logistica e trasporti",
  "Altro",
];

export default function LeadCapturePage() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    trackFormView("lead_capture_page");
  }, []);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      trackLeadSimple({ name, email, sector, source: "lead_page" });
      trackCTAClick("Lead Submit", "lead_page");
      setLocation("/grazie");
    },
    onError: (err) => {
      if (err.message.includes("Già iscritto") || err.message.includes("duplicate")) {
        trackLeadSimple({ name, email, sector, source: "lead_page" });
        setLocation("/grazie");
      } else {
        setError("Si è verificato un errore. Riprova.");
      }
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (!name.trim() || !email.trim() || !sector) {
        setError("Compila tutti i campi obbligatori.");
        return;
      }
      submitLead.mutate({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        sector,
        source: "lead_page",
      });
    },
    [name, email, phone, sector, submitLead]
  );

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      <SEOHead
        title="Mappa delle Opportunità IA — 80 processi analizzati per la tua PMI | Il Consigliere"
        description="Scopri dove la tua azienda perde tempo e denaro. 80 processi analizzati in 8 reparti. Scarica gratis la Mappa delle Opportunità IA."
        path="/lead"
      />

      {/* Header minimal — solo logo */}
      <header className="container">
        <div className="rule-thick mt-0" />
        <div className="flex items-center justify-between py-4">
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
      </header>

      {/* HERO + FORM */}
      <section className="container py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* FIX #1: Qualificador de audiência (não "esclusivo per iscritti") */}
              <p
                className="uppercase tracking-[0.15em] mb-3"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  color: "#C4704B",
                  fontWeight: 600,
                }}
              >
                Per imprenditori PMI con 10–50 dipendenti
              </p>

              {/* FIX #2 + #7: Headline com dor + dado "80 processi" */}
              <h1
                className="mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  fontWeight: 800,
                  color: "#1A1A1A",
                  lineHeight: 1.1,
                }}
              >
                I tuoi concorrenti stanno già usando l'IA.{" "}
                <span style={{ color: "#C4704B" }}>
                  Tu sai dove iniziare?
                </span>
              </h1>

              {/* FIX #3 + #5: Prova social concreta + Mappa = herói */}
              <p
                className="mb-5"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.1rem",
                  color: "#444",
                  lineHeight: 1.7,
                }}
              >
                La <strong>Mappa delle Opportunità IA</strong> analizza{" "}
                <strong>80 processi in 8 reparti</strong> della tua azienda e ti mostra
                esattamente dove stai perdendo tempo e denaro — e dove l'IA può intervenire domani.
              </p>

              {/* FIX #5: Guida = bônus (hierarquia clara) */}
              <p
                className="mb-8"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "#555",
                  lineHeight: 1.7,
                }}
              >
                In più, ricevi la <strong>Guida Transizione 5.0</strong> — come accedere ai €6,3 miliardi
                di fondi MIMIT che il Governo ha stanziato per le PMI che innovano.
              </p>

              {/* FIX #4: Badges com benefícios concretos (não "Newsletter Settimanale") */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  "Mappa delle Opportunità IA — 80 processi",
                  "Guida Transizione 5.0 — fondi MIMIT",
                  "1 caso pratico a settimana nella tua inbox",
                ].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      color: "#1B2A4A",
                      backgroundColor: "rgba(27,42,74,0.06)",
                      border: "1px solid rgba(27,42,74,0.12)",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {badge}
                  </span>
                ))}
              </div>

              {/* FIX #8: Lamberto — foto + credibilidade */}
              <div
                className="flex items-center gap-4 p-4"
                style={{
                  backgroundColor: "rgba(27,42,74,0.03)",
                  border: "1px solid rgba(27,42,74,0.08)",
                }}
              >
                <img
                  src={LAMBERTO_PHOTO}
                  alt="Lamberto Grinover"
                  className="w-14 h-14 rounded-full object-cover"
                  style={{ border: "2px solid rgba(27,42,74,0.15)" }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      marginBottom: "2px",
                    }}
                  >
                    Lamberto Grinover
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.7rem",
                      color: "#666",
                      lineHeight: 1.4,
                    }}
                  >
                    Ex-direttore operativo. Ha guidato la trasformazione digitale di PMI italiane
                    in 6 settori. Oggi aiuta imprenditori a implementare l'IA senza sprecare budget.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form
                onSubmit={handleSubmit}
                className="p-6 lg:p-8"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid oklch(0.85 0.005 60)",
                }}
              >
                <div className="w-full mb-5" style={{ borderTop: "3px solid #1B2A4A" }} />

                <h2
                  className="mb-5"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    lineHeight: 1.25,
                  }}
                >
                  Scarica la Mappa — gratis.
                </h2>

                {/* Nome */}
                <div className="mb-4">
                  <label
                    htmlFor="lead-name"
                    className="block uppercase tracking-[0.12em] mb-1"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.6rem",
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
                    className="w-full px-3 py-2.5 text-sm outline-none"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      border: "1px solid oklch(0.80 0.005 60)",
                      backgroundColor: "#fff",
                      color: "#1A1A1A",
                    }}
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label
                    htmlFor="lead-email"
                    className="block uppercase tracking-[0.12em] mb-1"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.6rem",
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
                    className="w-full px-3 py-2.5 text-sm outline-none"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      border: "1px solid oklch(0.80 0.005 60)",
                      backgroundColor: "#fff",
                      color: "#1A1A1A",
                    }}
                  />
                </div>

                {/* Telefono */}
                <div className="mb-4">
                  <label
                    htmlFor="lead-phone"
                    className="block uppercase tracking-[0.12em] mb-1"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.6rem",
                      color: "#999",
                      fontWeight: 500,
                    }}
                  >
                    Telefono
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+39 333 123 4567"
                    autoComplete="tel"
                    className="w-full px-3 py-2.5 text-sm outline-none"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      border: "1px solid oklch(0.80 0.005 60)",
                      backgroundColor: "#fff",
                      color: "#1A1A1A",
                    }}
                  />
                </div>

                {/* Settore */}
                <div className="mb-5">
                  <label
                    htmlFor="lead-sector"
                    className="block uppercase tracking-[0.12em] mb-1"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.6rem",
                      color: "#999",
                      fontWeight: 500,
                    }}
                  >
                    In quale settore opera? *
                  </label>
                  <select
                    id="lead-sector"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-sm outline-none appearance-none"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      border: "1px solid oklch(0.80 0.005 60)",
                      backgroundColor: "#fff",
                      color: sector ? "#1A1A1A" : "#999",
                    }}
                  >
                    <option value="" disabled>
                      Selezioni il suo settore...
                    </option>
                    {SECTORS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Error */}
                {error && (
                  <p
                    className="mb-3"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#c53030",
                    }}
                  >
                    {error}
                  </p>
                )}

                {/* FIX #6: CTA com verbo de ação própria */}
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
                  {submitLead.isPending ? "Invio in corso..." : "Scopri dove stai perdendo tempo →"}
                </button>

                {/* Privacy */}
                <p
                  className="text-center mt-3"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.6rem",
                    color: "#bbb",
                    lineHeight: 1.4,
                  }}
                >
                  Nessuno spam. Cancellazione in un click.
                  <br />I tuoi dati sono trattati secondo il GDPR.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="container pb-8">
        <div className="rule-thin mb-6" />
        <div className="flex items-center justify-center gap-6">
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
      </footer>
    </div>
  );
}
