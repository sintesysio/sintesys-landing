/**
 * Landing Page — Mappa delle Opportunità IA (€47)
 * Prodotto low-ticket: foglio Excel + 5 documenti Word
 * Long-form editoriale stile Il Sole 24 Ore
 * Struttura: 12 sezioni, ~1.450 parole, CTA in 3 posizioni
 * Sticky bar dopo 600px di scroll
 */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { trackCTAClick, trackPageView, trackInitiateCheckout } from "@/lib/tracking";
import { toast } from "sonner";

const BRAIN_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/brain-icon_a74d4c28.png";
const LAMBERTO_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/lamberto-grinover_a1c8f6fb.png";
const PRODUCT_MOCKUP = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/mappa-product-mockup-YeV4GMZTfumsJocuzn54Da.webp";

/* ─── Fade-in animation wrapper ─── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── CTA Button component ─── */
function CTAButton({ onClick, large = false, label = "Voglio la Mappa — €47" }: { onClick: () => void; large?: boolean; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="btn-terracotta"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: large ? "0.85rem" : "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: large ? "1rem 2.5rem" : "0.875rem 2rem",
        border: "none",
        cursor: "pointer",
        display: "inline-block",
        textAlign: "center",
      }}
    >
      {label}
    </button>
  );
}

/* ─── Sticky CTA Bar ─── */
function StickyBar({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: visible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        backgroundColor: "#1B2A4A",
        borderTop: "2px solid rgba(196,112,75,0.4)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.15)",
      }}
    >
      <div className="container flex items-center justify-between py-3">
        <p
          className="hidden sm:block"
          style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: "0.9rem",
            color: "#FAFAF7",
          }}
        >
          Mappa delle Opportunità IA — <strong>€47</strong>
        </p>
        <button
          onClick={onClick}
          className="btn-terracotta w-full sm:w-auto"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0.75rem 2rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Voglio la Mappa — €47
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* MAIN PAGE                                             */
/* ═══════════════════════════════════════════════════════ */
export default function MappaLandingPage() {
  const [showSticky, setShowSticky] = useState(false);

  // Track page view
  useEffect(() => {
    trackPageView("/mappa");
  }, []);

  // Show sticky bar after 600px scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleCTA = useCallback(async (location: string) => {
    trackCTAClick("Voglio la Mappa €47", location);
    trackInitiateCheckout({
      productName: "Mappa delle Opportunità IA",
      value: 47,
      currency: "EUR",
      includesOrderBump: false,
    });

    if (isCheckoutLoading) return;
    setIsCheckoutLoading(true);

    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ includeOrderBump: false }),
      });

      if (!res.ok) throw new Error("Errore nella creazione del checkout");

      const data = await res.json();

      if (data.url) {
        toast.info("Reindirizzamento al pagamento sicuro...");
        window.open(data.url, "_blank");
      } else {
        throw new Error("URL di checkout non disponibile");
      }
    } catch (err) {
      console.error("[Checkout] Error:", err);
      toast.error("Si è verificato un errore. Riprova tra qualche istante.");
    } finally {
      setIsCheckoutLoading(false);
    }
  }, [isCheckoutLoading]);

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* 1. HEADER — barra navy, brand                         */}
      {/* ═══════════════════════════════════════════════════════ */}
      <header style={{ backgroundColor: "#1B2A4A" }}>
        <div className="container flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <img src={BRAIN_ICON} alt="Sintesys.io" className="h-7 w-7 rounded-full" loading="eager" style={{ filter: "brightness(10)" }} />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#FAFAF7",
              }}
            >
              Sintesys.io
            </span>
          </Link>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.6rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(250,250,247,0.6)",
            }}
          >
            L'intelligenza operativa per la PMI italiana
          </span>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 2. HERO — sopra la piega                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container pt-12 lg:pt-20 pb-12 lg:pb-16">
        <div className="max-w-3xl">
          <FadeIn>
            <h1
              className="mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 4.5vw, 3rem)",
                fontWeight: 800,
                color: "#1A1A1A",
                lineHeight: 1.1,
              }}
            >
              Lavora dodici ore al giorno.{" "}
              <span style={{ color: "#C4704B" }}>La sua azienda non cresce.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              className="mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                fontWeight: 600,
                fontStyle: "italic",
                color: "#444",
                lineHeight: 1.4,
              }}
            >
              Non è la crisi. È il caos operativo che nessuno le ha ancora mappato.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p
              className="mb-8"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1.1rem",
                color: "#555",
                lineHeight: 1.85,
              }}
            >
              In trenta minuti, sul foglio che riceverà via email, scoprirà esattamente dove l'Intelligenza Artificiale può liberare ore della sua settimana — reparto per reparto, processo per processo. Senza teoria. Senza venditori. Senza fretta.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <CTAButton onClick={() => handleCTA("hero")} large />
            <div className="mt-4 flex flex-wrap gap-4">
              {["Pagamento sicuro", "Consegna immediata via email", "Garanzia 14 giorni"].map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    color: "#888",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 3. SOTTO LA PIEGA — il problema, in numeri            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: "rgba(27,42,74,0.04)" }}>
        <div className="container">
          <FadeIn>
            <div className="rule-thick mb-8 max-w-3xl" />
            <h2
              className="mb-8 max-w-3xl"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#1A1A1A",
                lineHeight: 1.15,
              }}
            >
              I dati che non ha mai visto messi in fila.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mb-10">
            {[
              { stat: "41,7%", desc: "degli imprenditori italiani di PMI ha pensato di chiudere a causa del burnout", source: "ISTAT, 2025" },
              { stat: "36,4%", desc: "si sente solo nel proprio ruolo", source: "Banca d'Italia, 2024" },
              { stat: "88%", desc: "vuole innovare. Solo il 26% ha effettivamente iniziato", source: "Politecnico di Milano, 2024" },
              { stat: "60%+", desc: "non sa che lo Stato italiano sta pagando fino al 50% degli investimenti in digitalizzazione", source: "Transizione 5.0" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="flex gap-4 items-start">
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.8rem",
                      fontWeight: 800,
                      color: "#C4704B",
                      lineHeight: 1,
                      flexShrink: 0,
                      minWidth: "4rem",
                    }}
                  >
                    {item.stat}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "0.95rem",
                        color: "#444",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.desc}
                    </p>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.6rem",
                        fontWeight: 500,
                        color: "#999",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Fonte: {item.source}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <p
              className="max-w-3xl"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1.05rem",
                color: "#444",
                lineHeight: 1.85,
                fontStyle: "italic",
              }}
            >
              Non è un problema di volontà. È un problema di mappa: nessuno le ha ancora mostrato, sulla <strong>sua</strong> azienda, dove esattamente l'IA può intervenire.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 4. LA STORIA — la sezione che vende                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container py-14 lg:py-20">
        <div className="max-w-3xl">
          <FadeIn>
            <div className="rule-thick mb-8" />
            <h2
              className="mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#1A1A1A",
                lineHeight: 1.15,
              }}
            >
              Le ore di un imprenditore italiano.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="drop-cap" style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.05rem", color: "#444", lineHeight: 1.85 }}>
              <p className="mb-5">
                Lunedì mattina, ore 7:30. È già al telefono col fornitore. Alle 9:00 controlla a mano un foglio Excel di scadenze. Alle 10:30 risponde a tre clienti che hanno già chiesto la stessa informazione la settimana scorsa. Alle 12:00 firma fatture che il commercialista le ha mandato perché qualcuno doveva controllarle.
              </p>
              <p className="mb-5">
                Pomeriggio: riunione coi venditori. Ognuno ha il suo file Excel. Nessuno ha gli stessi numeri. Sera: torna a casa. Apre il portatile. Aggiorna il CRM con le note delle chiamate del mattino. Sono le 22:30.
              </p>
              <p
                className="mb-5"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: "#1B2A4A",
                }}
              >
                Le sembra una giornata sua?
              </p>
              <p className="mb-5">
                Adesso si fermi un momento. Quanto di tutto questo era davvero <strong>il suo lavoro</strong> — quello per cui ha aperto l'azienda — e quanto era amministrazione, copia-incolla, promemoria, controlli?
              </p>
              <p>
                La Mappa serve esattamente a rispondere a questa domanda. Con numeri, non sensazioni.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 5. COSA RICEVERÀ — la promessa specifica              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: "#1B2A4A" }}>
        <div className="container">
          <FadeIn>
            <p
              className="uppercase tracking-[0.15em] mb-2"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                color: "rgba(250,250,247,0.5)",
                fontWeight: 500,
              }}
            >
              Il Prodotto
            </p>
            <h2
              className="mb-10"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#FAFAF7",
                lineHeight: 1.15,
              }}
            >
              Cosa riceverà.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Description */}
            <FadeIn delay={0.1}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1rem", color: "rgba(250,250,247,0.85)", lineHeight: 1.85 }}>
                <p className="mb-5">
                  Un foglio Excel professionale, in italiano, con <strong style={{ color: "#FAFAF7" }}>80 processi tipici</strong> di una PMI italiana già pre-mappati su <strong style={{ color: "#FAFAF7" }}>8 reparti</strong>: Vendite, Amministrazione, Produzione, Logistica, Customer Service, Marketing, Risorse Umane, Finanza.
                </p>
                <p className="mb-5">
                  Per ogni processo le bastano cinque secondi: quanto tempo ci passate alla settimana? Quante persone? Ci sono errori frequenti? Quanto è automatizzabile, secondo Lei?
                </p>
                <p className="mb-5">
                  Le celle in verde si compilano. Le formule sono protette: non può rovinarle nemmeno per sbaglio.
                </p>
                <p className="mb-5" style={{ color: "#FAFAF7", fontWeight: 500 }}>
                  Alla fine, la Dashboard le restituisce tre numeri concreti:
                </p>
                <div className="space-y-3 mb-6">
                  {[
                    "Quante ore alla settimana la sua azienda perde oggi su attività automatizzabili.",
                    "Quanto vale, in euro, un anno di quelle ore. Calcolato a 30 € l'ora media, su 48 settimane lavorative.",
                    "Le 10 priorità di intervento, ordinate per ROI potenziale. Non per moda. Per impatto sul suo conto economico.",
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mt-0.5"
                        style={{ backgroundColor: "#C4704B", color: "#FAFAF7", fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 700 }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ fontSize: "0.95rem" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <p>
                  E quattro documenti di accompagnamento, in formato Word: una guida onesta su cosa è davvero l'IA (senza hype), un manuale d'uso del foglio, 32 casi pratici reparto per reparto, e dieci errori comuni da evitare prima di firmare qualsiasi proposta di consulenza.
                </p>
              </div>
            </FadeIn>

            {/* Right: Product Mockup */}
            <FadeIn delay={0.2}>
              <div className="flex justify-center">
                <img
                  src={PRODUCT_MOCKUP}
                  alt="Mappa delle Opportunità IA — Excel e documenti Word"
                  className="w-full max-w-lg object-contain"
                  loading="lazy"
                  style={{ borderRadius: "4px" }}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 6. PER CHI È / PER CHI NON È                         */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container py-14 lg:py-20">
        <FadeIn>
          <div className="rule-thick mb-8 max-w-3xl" />
          <h2
            className="mb-10 max-w-3xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.15,
            }}
          >
            Per chi è. E per chi non è.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl">
          {/* È per Lei se */}
          <FadeIn delay={0.1}>
            <div>
              <h3
                className="mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#1B2A4A",
                }}
              >
                È per Lei se:
              </h3>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", color: "#444", lineHeight: 1.85 }}>
                {[
                  "Ha tra 10 e 50 dipendenti.",
                  "Sente che l'azienda dipende troppo da Lei.",
                  "Ha sentito parlare di IA mille volte e non sa ancora se è una cosa seria o moda.",
                  "Vuole una mappa specifica della sua azienda — non un corso, non un libro, non un webinar.",
                  "Ha trenta minuti veri da dedicarci.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 items-start mb-2">
                    <span style={{ color: "#C4704B", fontWeight: 700, flexShrink: 0 }}>—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Non è per Lei se */}
          <FadeIn delay={0.15}>
            <div>
              <h3
                className="mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#1B2A4A",
                }}
              >
                Non è per Lei se:
              </h3>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", color: "#444", lineHeight: 1.85 }}>
                {[
                  "Cerca una soluzione \"chiavi in mano\" da comprare e installare domani.",
                  "Vuole sentirsi dire che basta ChatGPT.",
                  "Cerca un consulente che le venda quello che lei vuole sentirsi dire.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 items-start mb-2">
                    <span style={{ color: "#999", fontWeight: 700, flexShrink: 0 }}>—</span>
                    <span>{item}</span>
                  </div>
                ))}
                <p className="mt-4" style={{ fontStyle: "italic", color: "#666" }}>
                  La Mappa è onesta. Se la sua azienda non è organizzata, lo dirà. Se la priorità non è IA ma ordine, lo dirà.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 7. CHI L'HA COSTRUITA — Lamberto + Sintesys.io        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: "rgba(27,42,74,0.04)" }}>
        <div className="container">
          <FadeIn>
            <div className="rule-thick mb-8 max-w-3xl" />
            <h2
              className="mb-8 max-w-3xl"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#1A1A1A",
                lineHeight: 1.15,
              }}
            >
              Chi ha costruito questo strumento.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-4xl items-start">
            <FadeIn delay={0.1} className="lg:col-span-3">
              <img
                src={LAMBERTO_PHOTO}
                alt="Lamberto Grinover — Fondatore di Sintesys.io"
                className="w-32 h-32 lg:w-full lg:h-auto object-cover rounded-sm"
                loading="lazy"
                style={{ filter: "grayscale(20%)" }}
              />
            </FadeIn>
            <FadeIn delay={0.15} className="lg:col-span-9">
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1rem", color: "#444", lineHeight: 1.85 }}>
                <p className="mb-5">
                  <strong style={{ color: "#1A1A1A" }}>Lamberto Grinover.</strong> Ex-dirigente, italiano, residente in Italia. Ha trascorso vent'anni dentro aziende manifatturiere italiane prima di fondare Sintesys.io. Conosce la differenza tra un caos ordinato e un'azienda fragile, perché l'ha vista da dentro.
                </p>
                <p className="mb-5">
                  Sintesys.io non vende software. Vende il metodo per portare ordine prima, e intelligenza dopo. La Mappa che riceverà è il primo strumento del metodo — quello che usiamo come punto di partenza con ogni nostro cliente di consulenza.
                </p>
                <p>
                  Adesso lo abbiamo reso disponibile in versione self-service. Costa 47 €. Per noi è un modo di farci conoscere senza dover mandare un commerciale a casa sua. Per Lei è un modo di capire se vale la pena, prima di investire un euro in più.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 8. COSA INCLUDE — ricap dei 6 deliverables            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container py-14 lg:py-20">
        <FadeIn>
          <div className="rule-thick mb-8 max-w-3xl" />
          <h2
            className="mb-10 max-w-3xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.15,
            }}
          >
            Tutto quello che è incluso, oggi, a 47 €.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl">
          {[
            {
              num: "1",
              title: "Mappa delle Opportunità IA (Excel)",
              desc: "Il foglio operativo, 13 fogli, 80 processi pre-mappati, dashboard automatica, formule protette.",
            },
            {
              num: "2",
              title: "Cosa è l'IA — Guida per l'Imprenditore (Word)",
              desc: "Il primer onesto. Tre famiglie di IA, quello che fa bene, quello che non fa. 15 minuti di lettura.",
            },
            {
              num: "3",
              title: "Come usare la Mappa (Word)",
              desc: "Il manuale operativo. Cinque minuti di lettura, trenta di compilazione.",
            },
            {
              num: "4",
              title: "32 Casi Pratici di IA per Reparto (Word)",
              desc: "Quattro casi concreti per ognuno degli otto reparti. Tempo liberato stimato. Difficoltà di implementazione.",
            },
            {
              num: "5",
              title: "10 Errori da Evitare (Word)",
              desc: "La checklist anti-fornitori-problematici. Le otto domande da fare prima di firmare qualsiasi proposta di consulenza IA.",
            },
            {
              num: "6",
              title: "Documento di Benvenuto",
              desc: "L'ordine consigliato di lettura, perché 30 minuti puliti valgono più di tre ore distratte.",
            },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div className="flex gap-4 items-start py-4" style={{ borderTop: "1px solid oklch(0.85 0.005 60)" }}>
                <span
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "#1B2A4A",
                    color: "#FAFAF7",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  {item.num}
                </span>
                <div>
                  <h3
                    className="mb-1"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      lineHeight: 1.3,
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
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <p
            className="mt-8 max-w-3xl"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "0.95rem",
              color: "#666",
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            Sei file. Italiano professionale. Consegna immediata sulla sua email subito dopo il pagamento.
          </p>
        </FadeIn>

        {/* CTA #2 — dopo Cosa Include */}
        <FadeIn delay={0.5}>
          <div className="mt-10">
            <CTAButton onClick={() => handleCTA("dopo_incluso")} large />
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 9. GARANZIA                                           */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: "rgba(27,42,74,0.04)" }}>
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <div className="rule-thick mb-8" />
              <h2
                className="mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.15,
                }}
              >
                La nostra garanzia, scritta in italiano semplice.
              </h2>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1rem", color: "#444", lineHeight: 1.85 }}>
                <p className="mb-5">
                  Ha quattordici giorni dal momento dell'acquisto. Apre il foglio, lo prova, lo legge. Se decide che non vale i 47 € che ha speso, le rimborsiamo l'intera cifra. Senza domande, senza moduli, senza giustificazioni.
                </p>
                <p className="mb-5">
                  Una sola email a <strong style={{ color: "#1B2A4A" }}>ciao@sintesys.io</strong> con scritto "rimborso" e l'oggetto del suo ordine. Bonifico entro tre giorni lavorativi.
                </p>
                <p style={{ fontStyle: "italic", color: "#666" }}>
                  Funziona così perché abbiamo già lavorato la versione attuale con decine di imprenditori, e sappiamo che la Mappa fa il suo mestiere. Se non lo fa per Lei, è giusto che non paghi.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 10. FAQ — stile editoriale                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="container py-14 lg:py-20">
        <FadeIn>
          <div className="rule-thick mb-8 max-w-3xl" />
          <h2
            className="mb-10 max-w-3xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.15,
            }}
          >
            Le domande che ci hanno fatto.
          </h2>
        </FadeIn>

        <div className="max-w-3xl space-y-0">
          {[
            {
              q: "Quanto tempo serve davvero?",
              a: "Trenta minuti di compilazione, dopo aver letto le istruzioni (cinque minuti). Se si distrae tra una telefonata e l'altra, conti un'ora. Non di più.",
            },
            {
              q: "Posso farla compilare al mio responsabile invece di farla io?",
              a: "Tecnicamente sì. Praticamente no. Il valore della Mappa dipende da chi conosce davvero l'azienda. Se delega, deleghi solo i reparti dove il responsabile ha visibilità completa. Per il quadro d'insieme serve Lei.",
            },
            {
              q: "Funziona anche per la mia azienda piccola? Sono in cinque.",
              a: "La Mappa è dimensionata per PMI tra 10 e 50 dipendenti. Sotto i 10, alcuni reparti predefiniti non si applicano. Funziona ancora, ma il valore relativo è minore. Sopra i 50, ha bisogno di qualcosa di più strutturato — la nostra Settimana Zero.",
            },
            {
              q: "E dopo la Mappa?",
              a: "Tre strade, spiegate dentro il foglio stesso. Può procedere da solo. Può prenotare una sessione di novanta minuti in diretta con Lamberto (Sessione Diagnosi IA, 127 €, sconto attivo per chi ha la Mappa). Oppure, se la sua mappa rivela un caos strutturato, può richiedere un audit operativo nella sua azienda (Settimana Zero, da 2.500 €). Nessuna pressione: decida Lei.",
            },
            {
              q: "Devo registrarmi a una piattaforma? Devo dare il mio numero?",
              a: "No. Compra, riceve i file via email, li apre sul suo computer. Non c'è una piattaforma. Non c'è un account. Non c'è un commerciale che la chiama. Il foglio è suo, una volta scaricato.",
            },
            {
              q: "E la privacy?",
              a: "I dati che inserisce nel foglio restano sul suo computer. Sintesys.io non ha accesso a quello che scrive. Il foglio non si connette a internet, non manda statistiche, non comunica con noi. Ce lo siamo costruiti così di proposito.",
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
      {/* 11. BLOCCO FINALE — la decisione                      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: "#1B2A4A" }}>
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2
                className="mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                  color: "#FAFAF7",
                  lineHeight: 1.15,
                }}
              >
                La domanda è una sola.
              </h2>
              <p
                className="mb-4"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  color: "rgba(250,250,247,0.8)",
                  lineHeight: 1.85,
                }}
              >
                Se tra dodici mesi la sua azienda lavora come oggi — stesse ore, stesso caos, stesse decisioni prese a istinto — quanto le costerà non aver mappato adesso dove l'IA poteva intervenire?
              </p>
              <p
                className="mb-4"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1rem",
                  color: "rgba(250,250,247,0.65)",
                  lineHeight: 1.7,
                }}
              >
                Quarantasette euro è il costo di una cena fuori in due.
              </p>
              <p
                className="mb-10"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1rem",
                  color: "rgba(250,250,247,0.65)",
                  lineHeight: 1.7,
                }}
              >
                Trenta minuti è il tempo di una riunione che probabilmente questa settimana ha già cancellato.
              </p>
              <p
                className="mb-8"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: "#FAFAF7",
                }}
              >
                La Mappa è qui. La porta è aperta.
              </p>

              {/* CTA #3 — grande, finale */}
              <CTAButton onClick={() => handleCTA("blocco_finale")} large label="Scarica la Mappa adesso — €47" />

              <div className="mt-5 flex flex-wrap justify-center gap-4">
                {[
                  "Pagamento sicuro Stripe",
                  "Consegna entro 2 minuti via email",
                  "Garanzia 14 giorni",
                  "Fattura disponibile per partita IVA",
                ].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.65rem",
                      fontWeight: 500,
                      color: "rgba(250,250,247,0.45)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 12. FOOTER                                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <footer className="container py-8" role="contentinfo">
        <div className="rule-thin mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src={BRAIN_ICON}
              alt="Sintesys.io"
              className="h-6 w-6 rounded-full"
              loading="lazy"
              style={{ filter: "brightness(0)" }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#999",
              }}
            >
              Sintesys.io — ciao@sintesys.io
            </span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://www.instagram.com/sintesys.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}
            >
              Instagram
            </a>
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
            <Link
              href="/data-deletion"
              className="no-underline"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}
            >
              Diritto di Recesso
            </Link>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              color: "#bbb",
            }}
          >
            © {new Date().getFullYear()} Sintesys.io — Tutti i diritti riservati.
          </p>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* STICKY BAR                                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <StickyBar visible={showSticky} onClick={() => handleCTA("sticky_bar")} />
    </div>
  );
}
