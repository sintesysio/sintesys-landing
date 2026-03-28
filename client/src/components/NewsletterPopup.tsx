/**
 * NewsletterPopup — Pop-up form that appears after 60 seconds on page.
 * Invites visitors to receive weekly sector-specific AI updates.
 * Uses the same leads endpoint with source: "popup".
 * Respects localStorage to not show again after dismiss or submit.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";

const STORAGE_KEY = "sintesys_popup_dismissed";
const DELAY_MS = 60_000; // 60 seconds

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

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      localStorage.setItem(STORAGE_KEY, "submitted");
    },
    onError: (err) => {
      if (err.message.includes("già registrato") || err.message.includes("duplicate")) {
        setSubmitted(true);
        localStorage.setItem(STORAGE_KEY, "submitted");
      } else {
        setError("Si è verificato un errore. Riprova.");
      }
    },
  });

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "dismissed");
  }, []);

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
        source: "popup",
      });
    },
    [name, email, phone, sector, submitLead]
  );

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(26, 26, 26, 0.6)", backdropFilter: "blur(4px)" }}
            onClick={handleClose}
          />

          {/* Pop-up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md pointer-events-auto"
              style={{
                backgroundColor: "#FAFAF7",
                border: "1px solid oklch(0.80 0.005 60)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1 transition-colors"
                style={{ color: "#999" }}
                aria-label="Chiudi"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="px-6 pt-6 pb-4">
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
                  Edizione Speciale
                </p>

                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    lineHeight: 1.2,
                    marginBottom: "0.5rem",
                  }}
                >
                  Ricevi ogni settimana le strategie IA per il tuo settore.
                </h2>

                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.9rem",
                    color: "#555",
                    lineHeight: 1.5,
                  }}
                >
                  Analisi esclusive, dati di mercato e casi studio selezionati per la tua industria. Zero spam, solo contenuti strategici.
                </p>
              </div>

              {/* Divider */}
              <div className="mx-6" style={{ borderTop: "1px solid oklch(0.80 0.005 60)" }} />

              {/* Form or Success */}
              <div className="px-6 pt-4 pb-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <div
                      className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: "#1B2A4A" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FAFAF7" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "#1A1A1A",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Iscrizione confermata.
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      Riceverai la prossima edizione direttamente nella tua casella.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Nome */}
                    <div>
                      <label
                        htmlFor="popup-name"
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
                        id="popup-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Mario Rossi"
                        required
                        autoComplete="name"
                        className="w-full px-3 py-2 text-sm outline-none transition-colors"
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
                        htmlFor="popup-email"
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
                        id="popup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mario@azienda.it"
                        required
                        autoComplete="email"
                        className="w-full px-3 py-2 text-sm outline-none transition-colors"
                        style={{
                          fontFamily: "'Source Serif 4', serif",
                          border: "1px solid oklch(0.80 0.005 60)",
                          backgroundColor: "#fff",
                          color: "#1A1A1A",
                        }}
                      />
                    </div>

                    {/* Telefono + Settore row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="popup-phone"
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
                          id="popup-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+39 333..."
                          autoComplete="tel"
                          className="w-full px-3 py-2 text-sm outline-none transition-colors"
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            border: "1px solid oklch(0.80 0.005 60)",
                            backgroundColor: "#fff",
                            color: "#1A1A1A",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="popup-sector"
                          className="block uppercase tracking-[0.12em] mb-1"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.6rem",
                            color: "#999",
                            fontWeight: 500,
                          }}
                        >
                          Settore *
                        </label>
                        <select
                          id="popup-sector"
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          required
                          className="w-full px-3 py-2 text-sm outline-none transition-colors"
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            border: "1px solid oklch(0.80 0.005 60)",
                            backgroundColor: "#fff",
                            color: sector ? "#1A1A1A" : "#999",
                            appearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 8px center",
                          }}
                        >
                          <option value="" disabled>
                            Seleziona...
                          </option>
                          {SECTORS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
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
                      className="w-full py-2.5 text-xs uppercase tracking-[0.15em] transition-all"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        backgroundColor: "#1B2A4A",
                        color: "#FAFAF7",
                        border: "none",
                        cursor: submitLead.isPending ? "wait" : "pointer",
                        opacity: submitLead.isPending ? 0.7 : 1,
                      }}
                    >
                      {submitLead.isPending ? "Invio in corso..." : "Ricevi Aggiornamenti Settimanali"}
                    </button>

                    {/* Privacy note */}
                    <p
                      className="text-center"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.6rem",
                        color: "#bbb",
                        lineHeight: 1.4,
                      }}
                    >
                      Nessuno spam. Puoi cancellarti in qualsiasi momento.
                      <br />I tuoi dati sono trattati secondo la normativa GDPR.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
