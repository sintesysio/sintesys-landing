/**
 * Masterclass Sales Page — /masterclass
 * Prodotto: Sessione live 90 min con Lamberto Grinover — €97
 * Design: Editorial style, focused on conversion
 */

import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { useEffect, useCallback } from "react";
import { trackCTAClick, trackPageView, trackInitiateCheckout } from "@/lib/tracking";


const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";
const LAMBERTO_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/lamberto-grinover_a1c8f6fb.png";

export default function MasterclassPage() {

  useEffect(() => {
    trackPageView("/masterclass");
  }, []);

  const handlePurchase = useCallback(async (location: string) => {
    trackCTAClick("Prenota Masterclass €97", location);
    trackInitiateCheckout({
      productName: "Masterclass Il Consigliere",
      value: 97,
      currency: "EUR",
      includesOrderBump: false,
    });

    // Fire Meta Pixel InitiateCheckout
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "InitiateCheckout", {
        value: 97,
        currency: "EUR",
        content_name: "Masterclass Il Consigliere",
      });
    }

    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productKey: "masterclass" }),
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  }, []);

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      <SEOHead
        title="Masterclass — 90 Minuti con Lamberto Grinover | Il Consigliere"
        description="Una sessione operativa di 90 minuti per capire esattamente dove l'IA può intervenire nella sua azienda. €97, una volta al mese, posti limitati."
        path="/masterclass"
      />

      {/* Minimal nav */}
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
          <Link
            href="/lead"
            className="no-underline"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#1B2A4A",
            }}
          >
            Ricevi la Mappa Gratis →
          </Link>
        </div>
        <div className="rule-thin" />
      </nav>

      {/* ANNOUNCEMENT BANNER */}
      <div className="w-full py-2.5 text-center" style={{ backgroundColor: "#1B2A4A" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em", color: "#FAFAF7" }}>
          Prossima sessione: <span style={{ color: "#C4704B" }}>Giugno 2026</span> · Posti disponibili: <span style={{ color: "#C4704B" }}>15</span>
        </p>
      </div>

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
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              color: "#C4704B",
              fontWeight: 600,
            }}
          >
            Evento Live · 1 volta al mese · 90 minuti
          </p>

          <h1
            className="mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 800,
              color: "#1A1A1A",
              lineHeight: 1.1,
            }}
          >
            90 minuti per capire esattamente cosa impedisce alla sua azienda di crescere.
          </h1>

          <p
            className="mb-8 max-w-2xl"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.15rem",
              color: "#444",
              lineHeight: 1.7,
            }}
          >
            Una sessione operativa con Lamberto Grinover — non un webinar generico. 
            Diagnosi della sua azienda, piano d'azione concreto, domande reali. 
            In diretta, con chi ha gestito operazioni da €200M.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-4 mb-8">
            {["Live su Zoom", "90 minuti", "1 volta al mese", "Posti limitati"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "#1B2A4A",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4704B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {badge}
              </span>
            ))}
          </div>

          <button
            onClick={() => handlePurchase("hero")}
            className="btn-terracotta"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "1rem 2.5rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Prenota il tuo posto — €97 →
          </button>
          <p
            className="mt-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "#888",
            }}
          >
            Pagamento sicuro via Stripe · Fattura disponibile
          </p>
        </motion.div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: "rgba(27,42,74,0.03)" }}>
        <div className="container">
          <div className="rule-thick mb-8 max-w-3xl" />
          <h2
            className="mb-10 max-w-3xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.2,
            }}
          >
            Cosa succede durante la Masterclass.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            {[
              {
                num: "01",
                title: "Diagnosi della sua azienda",
                desc: "Analizziamo insieme i processi della sua PMI. Dove perde tempo, dove perde denaro, dove l'IA può intervenire domani — non tra sei mesi.",
              },
              {
                num: "02",
                title: "Piano d'azione concreto",
                desc: "Non slide generiche. Un piano operativo personalizzato con priorità, tempistiche e ROI stimato per ogni intervento. Esce con un documento, non con appunti.",
              },
              {
                num: "03",
                title: "Domande reali, risposte operative",
                desc: "Sessione Q&A aperta. Le domande che non ha il coraggio di fare al suo consulente IT, qui trovano risposte concrete da chi ha implementato l'IA in aziende reali.",
              },
            ].map((item) => (
              <div key={item.num}>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "rgba(27,42,74,0.12)",
                  }}
                >
                  {item.num}
                </span>
                <h3
                  className="mt-2 mb-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.9rem",
                    color: "#555",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS LAMBERTO */}
      <section className="container py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-4xl">
          <div>
            <img
              src={LAMBERTO_PHOTO}
              alt="Lamberto Grinover"
              className="w-full max-w-sm"
              style={{ filter: "grayscale(20%)" }}
              loading="lazy"
            />
          </div>
          <div>
            <p
              className="uppercase tracking-[0.15em] mb-3"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.6rem",
                color: "#C4704B",
                fontWeight: 600,
              }}
            >
              Chi guida la sessione
            </p>
            <h2
              className="mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                fontWeight: 700,
                color: "#1A1A1A",
                lineHeight: 1.2,
              }}
            >
              Lamberto Grinover
            </h2>
            <div
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "0.95rem",
                color: "#444",
                lineHeight: 1.7,
              }}
            >
              <p className="mb-3">
                Ex-direttore operativo con €200M+ gestiti tra Italia e Brasile. Ha fondato Il Consigliere per tradurre la complessità dell'IA in risultati operativi misurabili per le PMI italiane.
              </p>
              <p className="mb-3">
                Non è un tecnico che parla di business. È un imprenditore che ha capito la tecnologia e la usa come leva strategica.
              </p>
              <p>
                Nella Masterclass, porta la stessa metodologia che usa con i clienti di consulenza privata — ma in un formato accessibile a €97.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR WHO */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: "rgba(196,112,75,0.06)" }}>
        <div className="container">
          <h2
            className="mb-8 max-w-3xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.2,
            }}
          >
            Per chi è la Masterclass.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {[
              "Imprenditori con 10-50 dipendenti che sanno che l'IA è importante ma non sanno da dove iniziare",
              "Titolari che hanno provato ChatGPT ma non hanno visto risultati concreti nel business",
              "Manager che vogliono un piano d'azione, non un altro corso teorico",
              "Chi ha compilato la Mappa e vuole capire come implementare le priorità identificate",
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <svg className="flex-shrink-0 mt-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4704B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.9rem",
                    color: "#444",
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING CTA */}
      <section className="container py-16 lg:py-24">
        <div className="max-w-2xl mx-auto text-center">
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
            €97. Una sessione. Un piano d'azione.
          </h2>
          <p
            className="mb-8 max-w-xl mx-auto"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1rem",
              color: "#555",
              lineHeight: 1.7,
            }}
          >
            Non è un abbonamento. Non è un corso da 40 ore. È una sessione live di 90 minuti dove esce con un piano operativo per la sua azienda. Se non trova valore, le rimborsiamo l'intero importo.
          </p>

          <button
            onClick={() => handlePurchase("pricing_block")}
            className="btn-terracotta"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "1.1rem 3rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Prenota il tuo posto — €97 →
          </button>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {["Pagamento sicuro Stripe", "Fattura per P.IVA", "Garanzia soddisfatti o rimborsati"].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  color: "#999",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: "rgba(27,42,74,0.03)" }}>
        <div className="container">
          <div className="rule-thick mb-8 max-w-3xl" />
          <h2
            className="mb-8 max-w-3xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.2,
            }}
          >
            Domande frequenti.
          </h2>
          <div className="max-w-3xl space-y-6">
            {[
              {
                q: "Quando è la prossima sessione?",
                a: "Le date vengono comunicate via email agli iscritti. Generalmente una volta al mese, il giovedì alle 18:00 CET.",
              },
              {
                q: "Posso partecipare se non ho ancora la Mappa?",
                a: "Sì, ma consigliamo di compilarla prima. La Mappa è gratuita per gli iscritti alla newsletter — iscriviti su /lead e ricevila subito. Compilarla prima della Masterclass le permette di arrivare con domande specifiche.",
              },
              {
                q: "È registrata?",
                a: "No. La Masterclass è live e non viene registrata. Questo garantisce che i partecipanti condividano liberamente i dati della propria azienda durante la sessione.",
              },
              {
                q: "Cosa succede se non posso partecipare?",
                a: "Può spostare la partecipazione alla sessione successiva, oppure richiedere il rimborso completo entro 14 giorni dall'acquisto.",
              },
              {
                q: "Quanti partecipanti ci sono?",
                a: "Massimo 15 per sessione. Questo garantisce che ogni partecipante abbia tempo per le proprie domande e che la sessione rimanga operativa, non generica.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="py-4"
                style={{ borderTop: "1px solid oklch(0.85 0.005 60)" }}
              >
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.q}
                </h3>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.9rem",
                    color: "#555",
                    lineHeight: 1.6,
                  }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 lg:py-20" style={{ backgroundColor: "#1B2A4A" }}>
        <div className="container text-center">
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "#FAFAF7",
              lineHeight: 1.2,
            }}
          >
            Il prossimo passo è suo.
          </h2>
          <p
            className="mb-8 max-w-xl mx-auto"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1rem",
              color: "rgba(250,250,247,0.7)",
              lineHeight: 1.7,
            }}
          >
            90 minuti. Un piano d'azione. La chiarezza che serve per decidere.
          </p>
          <button
            onClick={() => handlePurchase("final_cta")}
            className="btn-terracotta"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "1.1rem 3rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Prenota il tuo posto — €97 →
          </button>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="container py-8" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="rule-thin mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "#999",
            }}
          >
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
