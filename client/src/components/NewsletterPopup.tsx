/**
 * NewsletterPopup — Pop-up form for newsletter subscription.
 * Trigger: scroll 50% OR exit-intent (whichever fires first).
 * Frequency: max 1x per visitor every 14 days (localStorage timestamp).
 * Excluded pages: /mappa, /mappa/grazie, /grazie, /chi-siamo.
 * Form: email only.
 * Headline: A/B variants (random).
 * Confirmation: soft upsell to Mappa €95,50 (lancio) / €179,90 (regolare).
 * Updated per 08-Aggiornamento-Sito-LP.docx.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { trackLeadSimple, trackFormView } from "@/lib/tracking";

const STORAGE_KEY = "sintesys_popup_submitted";
const SEEN_KEY = "sintesys_popup_seen";
const COOLDOWN_DAYS = 14;
const EXCLUDED_PATHS = ["/mappa", "/mappa/grazie", "/grazie", "/chi-siamo"];

// A/B headline variants
const VARIANT_A = {
  headline: "Lo Stato paga il 50% della digitalizzazione della sua PMI.",
  subheadline: "Il 60% non lo sa. Scarica la Guida Transizione 5.0 — gratis.",
  cta: "Sì, voglio la Guida →",
};
const VARIANT_B = {
  headline: "Il caos operativo non è la crisi.",
  subheadline: "È il problema che nessuno le ha ancora mappato. La newsletter le mostra come uscirne — ogni settimana. Iscriviti gratis.",
  cta: "Iscriviti alla Newsletter →",
};

function getVariant(): typeof VARIANT_A {
  return Math.random() < 0.5 ? VARIANT_A : VARIANT_B;
}

function isExcludedPage(): boolean {
  const path = window.location.pathname;
  return EXCLUDED_PATHS.some((p) => path === p || path.startsWith(p + "/"));
}

function isWithinCooldown(): boolean {
  const seenTs = localStorage.getItem(SEEN_KEY);
  if (!seenTs) return false;
  const elapsed = Date.now() - parseInt(seenTs, 10);
  return elapsed < COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
}

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [variant] = useState(() => getVariant());
  const triggeredRef = useRef(false);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      localStorage.setItem(STORAGE_KEY, "submitted");
      trackLeadSimple({ name: "", email, source: "popup" });
    },
    onError: (err) => {
      if (err.message.includes("già registrato") || err.message.includes("duplicate")) {
        setSubmitted(true);
        localStorage.setItem(STORAGE_KEY, "submitted");
        trackLeadSimple({ name: "", email, source: "popup" });
      } else {
        setError("Si è verificato un errore. Riprova.");
      }
    },
  });

  const showPopup = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    localStorage.setItem(SEEN_KEY, String(Date.now()));
    setVisible(true);
    trackFormView("newsletter_popup");
  }, []);

  useEffect(() => {
    // Guard: excluded page, already submitted, or within cooldown
    if (isExcludedPage()) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (isWithinCooldown()) return;

    // Trigger 1: Scroll 50%
    const handleScroll = () => {
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= 0.5) {
        showPopup();
      }
    };

    // Trigger 2: Exit-intent (mouse leaves viewport top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [showPopup]);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!email.trim()) {
        setError("Inserisca il suo indirizzo email aziendale.");
        return;
      }

      submitLead.mutate({
        name: "",
        email: email.trim(),
        source: "popup",
      });
    },
    [email, submitLead]
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
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    lineHeight: 1.2,
                    marginBottom: "0.5rem",
                  }}
                >
                  {variant.headline}
                </h2>

                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.9rem",
                    color: "#555",
                    lineHeight: 1.5,
                  }}
                >
                  {variant.subheadline}
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
                      Perfetto. La guida arriverà nella sua email entro 2 minuti.
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "0.85rem",
                        color: "#666",
                        marginBottom: "1rem",
                      }}
                    >
                      Controlli anche lo spam.
                    </p>

                    {/* Soft upsell to Mappa in confirmation */}
                    <div
                      className="mt-3 p-4 text-left"
                      style={{
                        backgroundColor: "rgba(196,112,75,0.06)",
                        border: "1px solid rgba(196,112,75,0.2)",
                      }}
                    >
                      <p
                        className="uppercase tracking-[0.12em] mb-1"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.55rem",
                          color: "#C4704B",
                          fontWeight: 600,
                        }}
                      >
                        Mentre aspetta
                      </p>
                      <p
                        style={{
                          fontFamily: "'Source Serif 4', serif",
                          fontSize: "0.85rem",
                          color: "#444",
                          lineHeight: 1.5,
                          marginBottom: "0.5rem",
                        }}
                      >
                        Abbiamo costruito uno strumento self-service che le mostra in 30 minuti dove l'IA può intervenire specificamente nella <strong>SUA</strong> azienda. Si chiama <strong>Mappa delle Opportunità IA</strong>.
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#999",
                            textDecoration: "line-through",
                          }}
                        >
                          €179,90
                        </span>
                        <span
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "#C4704B",
                          }}
                        >
                          €95,50
                        </span>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.6rem",
                            color: "#999",
                          }}
                        >
                          fino ai primi 100 clienti · Garanzia 14 giorni
                        </span>
                      </div>
                      <a
                        href="/mappa"
                        className="inline-block px-4 py-2 text-xs uppercase tracking-[0.12em] no-underline"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          backgroundColor: "#C4704B",
                          color: "#FAFAF7",
                        }}
                      >
                        Scopri la Mappa — €95,50 →
                      </a>
                      <div className="mt-2">
                        <button
                          onClick={handleClose}
                          className="text-xs"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "#999",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Chiudi
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
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
                      <p
                        className="mt-1"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.55rem",
                          color: "#bbb",
                        }}
                      >
                        Inviamo solo a indirizzi aziendali — no Gmail/Yahoo personali.
                      </p>
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
                        backgroundColor: "#C4704B",
                        color: "#FAFAF7",
                        border: "none",
                        cursor: submitLead.isPending ? "wait" : "pointer",
                        opacity: submitLead.isPending ? 0.7 : 1,
                      }}
                    >
                      {submitLead.isPending ? "Invio in corso..." : variant.cta}
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
                      Niente spam. Niente vendita di dati. Cancellazione in 1 click. GDPR rispettato.
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
