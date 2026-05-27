/**
 * Masterclass Sales Page — /masterclass (v2 — Diagnóstico 9 pontos)
 *
 * Correções:
 * 1. Headline de venda (resultado, não título de produto)
 * 2. "Cosa succede" com detalhes concretos
 * 3. Ancoragem de valor (€500-1500/h vs €97)
 * 4. "Per chi è" movido para cima (perto do hero)
 * 5. Pré-enquadramento da consultoria All Hands no final
 * 6. "Posti limitati" com número concreto (max 20)
 * 7. Garantia com termos específicos
 * 8. Closing com urgência + objeção tratada
 * 9. FAQ com respostas claras
 */

import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { useEffect, useCallback } from "react";
import { trackCTAClick, trackPageView, trackInitiateCheckout } from "@/lib/tracking";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";
const LAMBERTO_PHOTO = "/manus-storage/lamberto-links-square-v2_c959460c.jpeg";

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
        title="In 120 minuti saprai esattamente dove l'IA può tagliare costi nella tua PMI | Il Consigliere"
        description="Sessione operativa live con Lamberto Grinover. Diagnosi personalizzata dei processi della tua azienda, piano d'azione concreto, Q&A. Posti limitati. €97."
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

        </div>
        <div className="rule-thin" />
      </nav>

      {/* FIX #6: ANNOUNCEMENT BANNER com número concreto */}
      <div className="w-full py-2.5 text-center" style={{ backgroundColor: "#1B2A4A" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em", color: "#FAFAF7" }}>
          Posti limitati e 1 turma al mese — <span style={{ color: "#C4704B" }}>Rimangono 9 posti</span>
        </p>
      </div>

      {/* FIX #1: HERO — headline de venda (resultado, não título) */}
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
            Sessione Live · Posti limitati · 120 minuti operativi
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
            In 120 minuti saprai esattamente dove la tua azienda perde soldi — e dove l'IA può intervenire domani.
          </h1>

          {/* FIX #4: "Per chi è" movido para perto do hero */}
          <p
            className="mb-6"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.1rem",
              color: "#444",
              lineHeight: 1.7,
            }}
          >
            Per titolari che hanno provato ChatGPT ma non hanno visto risultati concreti nel business. Per chi vuole un piano d'azione, non un altro corso teorico.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-4 mb-8">
            {["Live su Zoom — non registrata", "Diagnosi personalizzata", "Piano d'azione scritto", "Q&A illimitato"].map((badge) => (
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
            Pagamento sicuro via Stripe · Fattura per P.IVA disponibile
          </p>
        </motion.div>
      </section>

      {/* FIX #4: PER CHI È — seção expandida, posição alta */}
      <section className="py-12 lg:py-16" style={{ backgroundColor: "rgba(196,112,75,0.05)" }}>
        <div className="container">
          <h2
            className="mb-8 max-w-3xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.2,
            }}
          >
            Questa sessione è per lei se:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            {[
              "Ha 10-50 dipendenti e sa che l'IA è importante, ma non sa da dove iniziare senza sprecare budget",
              "Ha provato ChatGPT o altri strumenti ma non ha visto risultati concreti nel fatturato o nei costi",
              "Vuole un piano d'azione operativo, non un altro webinar teorico con slide generiche",
              "Ha compilato la Mappa delle Opportunità e vuole capire come implementare le priorità identificate",
              "È stanco di consulenti IT che parlano di tecnologia senza capire il business",
              "Vuole parlare con qualcuno che ha gestito operazioni reali, non con un formatore da palco",
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

      {/* FIX #2: COSA SUCCEDE — detalhes concretos e específicos */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: "rgba(27,42,74,0.03)" }}>
        <div className="container">
          <div className="rule-thick mb-8 max-w-3xl" />
          <h2
            className="mb-4 max-w-3xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.2,
            }}
          >
            Cosa succede in 120 minuti.
          </h2>
          <p
            className="mb-10 max-w-2xl"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "0.95rem",
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            Non è un webinar con slide. È una sessione operativa dove lavoriamo sulla sua azienda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            {[
              {
                num: "01",
                time: "0–40 min",
                title: "Diagnosi dei processi",
                desc: "Analizziamo i suoi 3 reparti più critici: dove il team perde ore in attività ripetitive, dove i dati non comunicano tra loro, dove le decisioni si bloccano per mancanza di informazioni. Usiamo la Mappa come punto di partenza.",
              },
              {
                num: "02",
                time: "40–80 min",
                title: "Piano d'azione con priorità e ROI",
                desc: "Costruiamo insieme un piano operativo: quali processi automatizzare per primi, con quale strumento, in quanto tempo, e con quale ritorno stimato. Esce con un documento scritto — non con appunti vaghi.",
              },
              {
                num: "03",
                time: "80–120 min",
                title: "Q&A — le domande che non osa fare",
                desc: "Sessione aperta. Budget reali, errori da evitare, fornitori da scegliere, tempistiche oneste. Le risposte che il suo consulente IT non le dà perché non ha gestito un'azienda.",
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
                <p
                  className="mt-1 mb-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#C4704B",
                  }}
                >
                  {item.time}
                </p>
                <h3
                  className="mb-2"
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
                    fontSize: "0.85rem",
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

      {/* WHO IS LAMBERTO — mantido (está bom no diagnóstico) */}
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
                <strong>Non è un tecnico che parla di business. È un imprenditore che ha capito la tecnologia e la usa come leva strategica.</strong>
              </p>
              <p>
                Nella Masterclass porta la stessa metodologia che usa nelle consulenze private da €1.500/sessione — in un formato accessibile per chi vuole iniziare con chiarezza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FIX #3: PRICING CTA com ancoragem de valor */}
      <section className="container py-16 lg:py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Ancoragem */}
          <p
            className="mb-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 500,
              color: "#999",
              letterSpacing: "0.05em",
            }}
          >
            Una consulenza privata con Lamberto costa €1.500/sessione.
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
            La Masterclass: €97. Stessa metodologia.
          </h2>
          <p
            className="mb-4 max-w-xl mx-auto"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1rem",
              color: "#555",
              lineHeight: 1.7,
            }}
          >
            Non è un abbonamento. Non è un corso da 40 ore. È una sessione live di 120 minuti dove esce con un piano operativo per la sua azienda — scritto, con priorità e ROI stimato.
          </p>

          {/* FIX #7: Garantia com termos específicos */}
          <p
            className="mb-8 max-w-lg mx-auto"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
              color: "#C4704B",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            Garanzia: se entro i primi 30 minuti ritiene che la sessione non faccia per lei, le rimborsiamo l'intero importo. Nessuna domanda.
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
            {["Pagamento sicuro Stripe", "Fattura per P.IVA", "Deducibile al 100%", "Posti limitati"].map((t) => (
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

      {/* FIX #9: FAQ com respostas claras e estratégicas */}
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
                q: "Posso partecipare senza aver compilato la Mappa?",
                a: "Sì, ma le consiglio fortemente di compilarla prima. La Mappa è gratuita — la riceve iscrivendosi alla newsletter su /lead. Arrivare con la Mappa compilata significa avere già chiaro dove la sua azienda perde tempo, e usare i 120 minuti per costruire il piano d'azione invece di fare la diagnosi da zero.",
              },
              {
                q: "In cosa è diversa da un webinar?",
                a: "Un webinar ha 500 persone, slide generiche e nessuna interazione. Qui siamo un gruppo ristretto. Lavoriamo sulla sua azienda. Le domande sono le sue. Il piano d'azione è personalizzato. E non viene registrata — quindi i partecipanti condividono dati reali.",
              },
              {
                q: "€97 — cosa include esattamente?",
                a: "120 minuti live su Zoom con Lamberto. Diagnosi dei processi critici della sua azienda. Piano d'azione scritto con priorità e ROI stimato. Sessione Q&A illimitata. Nessun upsell durante la sessione — solo contenuto operativo.",
              },
              {
                q: "Quando è la prossima sessione?",
                a: "Le date vengono comunicate via email agli iscritti. Generalmente una volta al mese, il giovedì alle 18:00 CET. Dopo l'acquisto riceve il link Zoom e la data confermata.",
              },
              {
                q: "E se non posso partecipare alla data prevista?",
                a: "Può spostare alla sessione successiva senza costi aggiuntivi. Oppure richiedere il rimborso completo entro 14 giorni dall'acquisto — nessuna domanda, nessuna complicazione.",
              },
              {
                q: "È registrata?",
                a: "No. La sessione non viene registrata. Questo è intenzionale: garantisce che ogni partecipante condivida liberamente numeri e situazioni reali della propria azienda. È anche ciò che rende la sessione irripetibile — se perde la data, perde il contenuto.",
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

      {/* FIX #5: Pré-enquadramento consultoria + FIX #8: Closing forte */}
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
            Ogni mese che passa senza un piano, i suoi concorrenti avanzano.
          </h2>
          <p
            className="mb-4 max-w-xl mx-auto"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1rem",
              color: "rgba(250,250,247,0.75)",
              lineHeight: 1.7,
            }}
          >
            €97 per 120 minuti di chiarezza. Un piano d'azione scritto. La certezza di sapere esattamente dove investire — e dove non sprecare un euro.
          </p>

          {/* FIX #5: Pré-enquadramento */}
          <p
            className="mb-8 max-w-lg mx-auto"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              color: "rgba(250,250,247,0.5)",
              lineHeight: 1.5,
            }}
          >
            Al termine della sessione, per chi vuole andare oltre, presento brevemente come lavoro con le PMI che scelgono l'implementazione guidata. Nessun obbligo — solo un'opzione per chi vuole accelerare.
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

          {/* FIX #7: Garantia reforçada no closing */}
          <p
            className="mt-4"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "rgba(250,250,247,0.5)",
            }}
          >
            Rimborso garantito entro i primi 30 minuti. Zero rischio.
          </p>
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
