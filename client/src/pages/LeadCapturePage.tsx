/**
 * /lead — Página de Captura de Lead (v4 — Multi-dobra + Form Pop-up)
 *
 * Estrutura:
 * Dobra 1: Headline + Sub (dor + urgência)
 * Dobra 2: O que é a Mappa + resultado que gera
 * Dobra 3: O que recebe na Newsletter (não é só email)
 * Dobra 4: Quem é o Lamberto
 * CTA: Botão que abre formulário em pop-up/modal
 */

import { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import SEOHead from "@/components/SEOHead";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { trackLeadSimple, trackFormView, trackCTAClick } from "@/lib/tracking";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";
const LAMBERTO_PHOTO = "/manus-storage/lamberto-headshot-new_6b6d2d62.jpeg";

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
  const [showModal, setShowModal] = useState(false);
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

  const openModal = () => {
    setShowModal(true);
    trackCTAClick("Open Form Modal", "lead_page");
  };

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

      {/* ═══════════════════════════════════════════════════════════════
          DOBRA 1: Headline + Sub (dor + urgência)
         ═══════════════════════════════════════════════════════════════ */}
      <section className="container py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p
            className="uppercase tracking-[0.15em] mb-4"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              color: "#C4704B",
              fontWeight: 600,
            }}
          >
            Per imprenditori PMI con 10–50 dipendenti
          </p>

          <h1
            className="mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              color: "#1A1A1A",
              lineHeight: 1.08,
            }}
          >
            I tuoi concorrenti stanno già usando l'IA.{" "}
            <span style={{ color: "#C4704B" }}>Tu sai dove iniziare?</span>
          </h1>

          <p
            className="mb-10 mx-auto"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.15rem",
              color: "#444",
              lineHeight: 1.7,
              maxWidth: "600px",
            }}
          >
            La Mappa delle Opportunità IA analizza <strong>80 processi in 8 reparti</strong> della tua azienda
            e ti mostra esattamente dove stai perdendo tempo e denaro — e dove l'IA può intervenire domani.
          </p>

          {/* CTA principal */}
          <button
            onClick={openModal}
            className="inline-block px-10 py-4 text-xs uppercase tracking-[0.15em] transition-all"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              backgroundColor: "#C4704B",
              color: "#FAFAF7",
              border: "none",
              cursor: "pointer",
            }}
          >
            Scopri dove stai perdendo tempo →
          </button>

          <p
            className="mt-4"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "#999",
            }}
          >
            Gratis. Nessuna carta di credito richiesta.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DOBRA 2: O que é a Mappa + resultado que gera
         ═══════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#fff" }}>
        <div className="container py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-3xl mx-auto">
              <p
                className="uppercase tracking-[0.15em] mb-3"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.6rem",
                  color: "#C4704B",
                  fontWeight: 600,
                }}
              >
                Cosa ricevi
              </p>
              <h2
                className="mb-8"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.15,
                }}
              >
                La Mappa delle Opportunità IA
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {[
                  {
                    title: "80 processi analizzati",
                    desc: "Ogni processo della tua azienda — dall'amministrazione alla produzione — valutato per potenziale di automazione con IA.",
                  },
                  {
                    title: "8 reparti coperti",
                    desc: "Vendite, marketing, operations, HR, finanza, customer service, logistica e IT. Nessun angolo cieco.",
                  },
                  {
                    title: "Priorità chiare",
                    desc: "Non un elenco generico. Una classifica: dove iniziare, cosa ignorare, cosa delegare all'IA subito.",
                  },
                  {
                    title: "Risultato in 10 minuti",
                    desc: "Compili la Mappa, e in 10 minuti sa esattamente da dove partire. Senza consulenti, senza attese.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
                      style={{ backgroundColor: "rgba(196,112,75,0.1)" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4704B" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#1A1A1A",
                          marginBottom: "4px",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Source Serif 4', serif",
                          fontSize: "0.9rem",
                          color: "#666",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bônus: Guida */}
              <div
                className="p-5 flex items-start gap-4"
                style={{
                  backgroundColor: "rgba(27,42,74,0.03)",
                  border: "1px solid rgba(27,42,74,0.08)",
                }}
              >
                <span
                  className="flex-shrink-0 inline-block px-2 py-0.5 text-xs uppercase tracking-wider"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.55rem",
                    color: "#1B2A4A",
                    backgroundColor: "rgba(27,42,74,0.08)",
                  }}
                >
                  Bonus
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#1A1A1A",
                      marginBottom: "4px",
                    }}
                  >
                    Guida Transizione 5.0
                  </p>
                  <p
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "0.85rem",
                      color: "#666",
                      lineHeight: 1.5,
                    }}
                  >
                    Come accedere ai €6,3 miliardi di fondi MIMIT che il Governo ha stanziato per le PMI che innovano.
                    Requisiti, scadenze, e come presentare domanda.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DOBRA 3: O que recebe na Newsletter (não é só email)
         ═══════════════════════════════════════════════════════════════ */}
      <section className="container py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-3xl mx-auto">
            <p
              className="uppercase tracking-[0.15em] mb-3"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.6rem",
                color: "#C4704B",
                fontWeight: 600,
              }}
            >
              Ogni settimana nella tua inbox
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
              Non è solo una newsletter.
            </h2>
            <p
              className="mb-10"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1.05rem",
                color: "#555",
                lineHeight: 1.7,
              }}
            >
              È il briefing settimanale che un imprenditore PMI legge in 5 minuti per sapere cosa sta cambiando
              nel mondo dell'IA — e cosa può fare lunedì mattina.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  icon: "📰",
                  title: "1 caso reale di PMI",
                  desc: "Ogni settimana, un'azienda italiana (10-50 dipendenti) che ha implementato l'IA. Cosa ha fatto, quanto ha speso, che risultato ha ottenuto.",
                },
                {
                  icon: "🔧",
                  title: "1 strumento testato",
                  desc: "Non la lista dei 100 tool. Uno solo, testato da Lamberto, con istruzioni per usarlo nella tua operazione.",
                },
                {
                  icon: "📊",
                  title: "1 dato di mercato",
                  desc: "Il numero della settimana che ogni titolare dovrebbe conoscere. Incentivi, trend, benchmark di settore.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(27,42,74,0.08)",
                  }}
                >
                  <span className="text-2xl mb-3 block">{item.icon}</span>
                  <h3
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#1A1A1A",
                      marginBottom: "6px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "0.85rem",
                      color: "#666",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA secundário */}
            <div className="text-center">
              <button
                onClick={openModal}
                className="inline-block px-8 py-3.5 text-xs uppercase tracking-[0.15em] transition-all"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  backgroundColor: "#1B2A4A",
                  color: "#FAFAF7",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Iscriviti e ricevi tutto — gratis →
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DOBRA 4: Quem é o Lamberto
         ═══════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#fff" }}>
        <div className="container py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Foto */}
                <div className="md:col-span-4 flex justify-center">
                  <img
                    src={LAMBERTO_PHOTO}
                    alt="Lamberto Grinover"
                    className="w-48 h-48 rounded-full object-cover"
                    style={{ border: "3px solid rgba(27,42,74,0.1)" }}
                  />
                </div>

                {/* Bio */}
                <div className="md:col-span-8">
                  <p
                    className="uppercase tracking-[0.15em] mb-2"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.6rem",
                      color: "#C4704B",
                      fontWeight: 600,
                    }}
                  >
                    Chi c'è dietro Il Consigliere
                  </p>
                  <h2
                    className="mb-4"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(1.4rem, 3vw, 2rem)",
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
                      fontSize: "1rem",
                      color: "#444",
                      lineHeight: 1.7,
                    }}
                  >
                    Ex-direttore operativo con 20+ anni di esperienza nella trasformazione digitale
                    di PMI italiane in 6 settori diversi. Non è un tecnico che parla di business —
                    è un uomo d'azienda che ha imparato a usare la tecnologia dove conta davvero.
                  </p>
                  <p
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "1rem",
                      color: "#444",
                      lineHeight: 1.7,
                    }}
                  >
                    Oggi aiuta imprenditori PMI a implementare l'IA senza sprecare budget in soluzioni
                    che non servono — partendo sempre dai processi, mai dalla tecnologia.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DOBRA FINAL: CTA + urgência
         ═══════════════════════════════════════════════════════════════ */}
      <section className="container py-16 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.15,
            }}
          >
            Ogni mese che passa senza un piano, i tuoi concorrenti avanzano.
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
            La Mappa ti dà chiarezza in 10 minuti. Gratis. Senza impegno.
          </p>
          <button
            onClick={openModal}
            className="inline-block px-10 py-4 text-xs uppercase tracking-[0.15em] transition-all"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              backgroundColor: "#C4704B",
              color: "#FAFAF7",
              border: "none",
              cursor: "pointer",
            }}
          >
            Scarica la Mappa — gratis →
          </button>
          <p
            className="mt-4"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "#999",
            }}
          >
            Nessuno spam. Cancellazione in un click. GDPR compliant.
          </p>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="container pb-8">
        <div className="rule-thin mb-6" />
        <div className="flex items-center justify-center gap-6">
          <Link
            href="/privacy-policy"
            className="no-underline"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="no-underline"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}
          >
            Termini di Servizio
          </Link>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: Formulário Pop-up
         ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md relative"
              style={{ backgroundColor: "#FAFAF7" }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center"
                style={{ color: "#999", cursor: "pointer", border: "none", background: "none" }}
                aria-label="Chiudi"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="w-full mb-5" style={{ borderTop: "3px solid #C4704B" }} />

                <h2
                  className="mb-2"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    lineHeight: 1.25,
                  }}
                >
                  Ricevi la Mappa — gratis.
                </h2>
                <p
                  className="mb-6"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.85rem",
                    color: "#666",
                    lineHeight: 1.5,
                  }}
                >
                  Compili i campi e riceve subito la Mappa delle Opportunità IA + la Guida Transizione 5.0.
                </p>

                {/* Nome */}
                <div className="mb-4">
                  <label
                    htmlFor="lead-name"
                    className="block uppercase tracking-[0.12em] mb-1"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "#999", fontWeight: 500 }}
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
                      border: "1px solid #ddd",
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
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "#999", fontWeight: 500 }}
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
                      border: "1px solid #ddd",
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
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "#999", fontWeight: 500 }}
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
                      border: "1px solid #ddd",
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
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "#999", fontWeight: 500 }}
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
                      border: "1px solid #ddd",
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
                  <p className="mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#c53030" }}>
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
                  {submitLead.isPending ? "Invio in corso..." : "Scopri dove stai perdendo tempo →"}
                </button>

                <p
                  className="text-center mt-3"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "#bbb", lineHeight: 1.4 }}
                >
                  Nessuno spam. Cancellazione in un click. I tuoi dati sono trattati secondo il GDPR.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
