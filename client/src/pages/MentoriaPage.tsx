/**
 * Mentoria Page — /mentoria
 * Non-indexed, access by direct link only
 * High-ticket: 12-month mentoring program with Lamberto
 */

import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { trackCTAClick, trackPageView } from "@/lib/tracking";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";

export default function MentoriaPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefono: "",
    azienda: "",
    dipendenti: "",
    motivazione: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      // Fire Meta Pixel Lead event for mentoria
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "mentoria",
          value: 0,
          currency: "EUR",
        });
      }
    },
    onError: () => {
      toast.error("Errore nell'invio. Riprovi tra qualche secondo.");
    },
  });

  useEffect(() => {
    trackPageView("/mentoria");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackCTAClick("Candidatura Mentoria", "mentoria_form");
    submitLead.mutate({
      name: formData.nome,
      email: formData.email,
      phone: formData.telefono,
      sector: formData.azienda,
      source: "mentoria_page",
    });
  };

  if (submitted) {
    return (
      <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
        <SEOHead title="Candidatura Ricevuta | Il Consigliere" description="Candidatura ricevuta. Risposta entro 72 ore." path="/mentoria" noindex />
        <nav className="container" style={{ backgroundColor: "#FAFAF7" }}>
          <div className="rule-thick mt-0" />
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <img src={LOGO_ICON} alt="Il Consigliere" className="h-8 w-8 rounded-full" loading="eager" />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#1A1A1A" }}>
                Il Consigliere
              </span>
            </Link>
          </div>
          <div className="rule-thin" />
        </nav>
        <section className="container py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: "rgba(196,112,75,0.1)" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C4704B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "#1A1A1A", lineHeight: 1.1 }}>
              Candidatura ricevuta.
            </h1>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.1rem", color: "#444", lineHeight: 1.7 }}>
              Lamberto esamina personalmente ogni candidatura. Se il profilo è compatibile con il programma, riceverà un'email entro 72 ore con i dettagli per il colloquio conoscitivo.
            </p>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      <SEOHead
        title="Mentoria in Gruppo — 12 Mesi con Lamberto Grinover | Il Consigliere"
        description="Dodici mesi per costruire l'azienda che non dipende da lei. Accesso su candidatura."
        path="/mentoria"
        noindex
      />

      {/* Minimal nav */}
      <nav className="container" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="rule-thick mt-0" />
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <img src={LOGO_ICON} alt="Il Consigliere" className="h-8 w-8 rounded-full" loading="eager" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#1A1A1A" }}>
              Il Consigliere
            </span>
          </Link>
          <Link
            href="/masterclass"
            className="no-underline"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1B2A4A" }}
          >
            Masterclass €97 →
          </Link>
        </div>
        <div className="rule-thin" />
      </nav>

      {/* HERO */}
      <section className="container py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p
            className="uppercase tracking-[0.15em] mb-4"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#C4704B", fontWeight: 600 }}
          >
            Riservato · Accesso su candidatura · Max 8 imprenditori
          </p>

          <h1
            className="mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 800, color: "#1A1A1A", lineHeight: 1.1 }}
          >
            Dodici mesi per costruire l'azienda che non dipende da lei.
          </h1>

          <p
            className="mb-8 max-w-2xl"
            style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.15rem", color: "#444", lineHeight: 1.7 }}
          >
            Un percorso di mentoria in gruppo ristretto con Lamberto Grinover. Non un corso. Non un mastermind generico. 
            Un anno di lavoro strutturato per trasformare la sua PMI in un'organizzazione che funziona anche senza di lei.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-4 mb-8">
            {["12 mesi", "Max 8 imprenditori", "2 call/mese", "Accesso diretto a Lamberto"].map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500, color: "#1B2A4A" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4704B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: "rgba(27,42,74,0.03)" }}>
        <div className="container">
          <div className="rule-thick mb-8 max-w-3xl" />
          <h2 className="mb-10 max-w-3xl" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2 }}>
            Cosa include il programma.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {[
              { title: "2 sessioni di gruppo al mese", desc: "90 minuti ciascuna. Hot seat a rotazione — ogni mese è il suo turno di presentare sfide e ricevere feedback operativo dal gruppo e da Lamberto." },
              { title: "Accesso diretto via WhatsApp", desc: "Domande urgenti, decisioni da prendere, dubbi strategici. Lamberto risponde entro 24 ore. Non è un chatbot — è un consulente che conosce la sua azienda." },
              { title: "Audit trimestrale personalizzato", desc: "Ogni 3 mesi, revisione completa dei progressi. Cosa ha funzionato, cosa no, cosa aggiustare. Con metriche concrete, non sensazioni." },
              { title: "Rete di imprenditori selezionati", desc: "8 imprenditori con sfide simili. Nessun competitor diretto. Collaborazione, referral, e la possibilità di imparare dagli errori (e successi) degli altri." },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1A1A1A" }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.9rem", color: "#555", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHO */}
      <section className="container py-14 lg:py-20">
        <h2 className="mb-8 max-w-3xl" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2 }}>
          Per chi è questo programma.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {[
            "Imprenditori con 10-50 dipendenti che vogliono scalare senza lavorare di più",
            "Titolari che hanno già provato la Masterclass e vogliono un percorso continuativo",
            "PMI che hanno bisogno di un consulente strategico ma non possono permettersi un advisory board",
            "Chi vuole costruire processi che funzionano anche in sua assenza",
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <svg className="flex-shrink-0 mt-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4704B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.9rem", color: "#444", lineHeight: 1.6 }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: "rgba(196,112,75,0.06)" }}>
        <div className="container">
          <div className="max-w-xl mx-auto">
            <h2 className="mb-3 text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2 }}>
              Candidatura
            </h2>
            <p className="mb-8 text-center" style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", color: "#555", lineHeight: 1.6 }}>
              Compili il modulo. Lamberto esamina personalmente ogni candidatura e risponde entro 72 ore.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Nome e Cognome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="mt-1.5 w-full px-4 py-3"
                  style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", border: "1px solid #ddd", backgroundColor: "#fff" }}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1.5 w-full px-4 py-3"
                  style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", border: "1px solid #ddd", backgroundColor: "#fff" }}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Telefono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="mt-1.5 w-full px-4 py-3"
                  style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", border: "1px solid #ddd", backgroundColor: "#fff" }}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Azienda e settore *
                </label>
                <input
                  type="text"
                  required
                  value={formData.azienda}
                  onChange={(e) => setFormData({ ...formData, azienda: e.target.value })}
                  className="mt-1.5 w-full px-4 py-3"
                  placeholder="Es: Rossi Srl — Manifattura"
                  style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", border: "1px solid #ddd", backgroundColor: "#fff" }}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Numero dipendenti *
                </label>
                <select
                  required
                  value={formData.dipendenti}
                  onChange={(e) => setFormData({ ...formData, dipendenti: e.target.value })}
                  className="mt-1.5 w-full px-4 py-3"
                  style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", border: "1px solid #ddd", backgroundColor: "#fff" }}
                >
                  <option value="">Seleziona</option>
                  <option value="1-10">1-10</option>
                  <option value="10-25">10-25</option>
                  <option value="25-50">25-50</option>
                  <option value="50+">50+</option>
                </select>
              </div>
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Perché vuole partecipare? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.motivazione}
                  onChange={(e) => setFormData({ ...formData, motivazione: e.target.value })}
                  className="mt-1.5 w-full px-4 py-3"
                  placeholder="Descriva brevemente la sfida principale della sua azienda e cosa si aspetta dal programma."
                  style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", border: "1px solid #ddd", backgroundColor: "#fff", resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitLead.isPending}
                className="w-full btn-terracotta"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "1rem 2rem",
                  border: "none",
                  cursor: "pointer",
                  opacity: submitLead.isPending ? 0.7 : 1,
                }}
              >
                {submitLead.isPending ? "Invio in corso..." : "Invia candidatura →"}
              </button>

              <p className="text-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#999" }}>
                I suoi dati sono protetti. Non condividiamo informazioni con terzi.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="container py-8" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="rule-thin mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}>
            © {new Date().getFullYear()} Il Consigliere — Tutti i diritti riservati.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="no-underline" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#999" }}>
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="no-underline" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#999" }}>
              Termini di Servizio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
