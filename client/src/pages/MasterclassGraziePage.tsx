/**
 * Masterclass Thank You Page — /masterclass/grazie
 * Shown after successful Masterclass purchase
 *
 * Diagnóstico aplicado:
 * 1. ADICIONADO: Pré-enquadramento consultoria All Hands
 * 2. ADICIONADO: Confirmação pagamento + instrução fattura P.IVA
 * 3. ADICIONADO: Data/hora da sessão visível
 * 4. REMOVIDO: "Si presenti puntuale" (condescendente)
 * 5. CORRIGIDO: "Prepari domande" com direção específica
 * 6. ADICIONADO: Reforço emocional da compra
 * 7. CONFIRMADO: Pixel Purchase como evento padrão
 */

import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { trackConversion } from "@/lib/tracking";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/DGHYBvKacnsPXkFQ.png";

export default function MasterclassGraziePage() {
  useEffect(() => {
    trackConversion({ source: "masterclass_purchase" });
    // FIX #7: Fire Meta Pixel Purchase event (standard event, not custom)
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase", {
        value: 97,
        currency: "EUR",
        content_name: "Masterclass Il Consigliere",
        content_type: "product",
      });
    }
  }, []);

  return (
    <div style={{ backgroundColor: "#FAFAF7", minHeight: "100vh" }}>
      <SEOHead
        title="Perfetto — Il suo posto è confermato | Il Consigliere"
        description="Ha preso la decisione giusta. Ora si prepari a usare bene questi 90 minuti."
        path="/masterclass/grazie"
        noindex
      />

      {/* Navbar minimal */}
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

      {/* Content */}
      <section className="container py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success icon */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ backgroundColor: "rgba(196,112,75,0.1)" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C4704B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* H1 */}
          <h1
            className="mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#1A1A1A",
              lineHeight: 1.1,
            }}
          >
            Perfetto. Il suo posto è confermato.
          </h1>

          {/* FIX #6: Reforço emocional */}
          <p
            className="mb-8"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.15rem",
              color: "#444",
              lineHeight: 1.7,
            }}
          >
            Ha preso la decisione giusta. Ora si prepari a usare bene questi 90 minuti.
          </p>

          {/* FIX #3: Bloco de confirmação — data/hora + FIX #2: pagamento/fattura */}
          <div
            className="p-6 lg:p-8 mb-8 text-left"
            style={{
              backgroundColor: "#fff",
              border: "2px solid #C4704B",
            }}
          >
            <h2
              className="mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Dettagli della sessione
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#C4704B" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", color: "#333", lineHeight: 1.6 }}>
                  <strong>Prossima sessione:</strong> la data esatta viene comunicata via email entro 48 ore. Live su Zoom, ore 18:00 CET.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#C4704B" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", color: "#333", lineHeight: 1.6 }}>
                  <strong>Link Zoom:</strong> arriva 24 ore prima da <em>lamberto@ilconsigliere.io</em>. Controlli anche lo spam.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#C4704B" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", color: "#333", lineHeight: 1.6 }}>
                  <strong>Ricevuta:</strong> inviata alla stessa email. Per fattura con P.IVA, risponda all'email di conferma indicando i dati fiscali.
                </p>
              </div>
            </div>
          </div>

          {/* Steps — FIX #4 e #5 */}
          <div
            className="p-6 lg:p-8 mb-8 text-left"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e5e5e5",
            }}
          >
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Come arrivare pronti
            </h2>
            <div className="space-y-5">
              {[
                {
                  step: "1",
                  title: "Compili la Mappa delle Opportunità IA",
                  desc: "Se non l'ha già fatto, la riceve gratuitamente iscrivendosi alla newsletter. Identifichi i 3 processi con il maggior potenziale per la sua azienda. Saranno il punto di partenza della diagnosi durante la sessione.",
                  link: { text: "→ Ricevi la Mappa gratis", href: "/lead" },
                },
                {
                  step: "2",
                  title: "Prepari 2-3 domande sulla sua operazione",
                  desc: "Non domande generiche sull'IA. Domande specifiche sulla sua azienda: \"Nel mio settore, dove conviene iniziare?\", \"Ho già [strumento X] — si integra con quello che suggerisce?\". Più è specifico, più valore porta a casa.",
                },
                {
                  step: "3",
                  title: "Tenga pronto qualcosa per appuntare",
                  desc: "La sessione non viene registrata. Le priorità e il piano d'azione emergono in diretta — vale la pena annotarli.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span
                    className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "#FAFAF7",
                      backgroundColor: "#C4704B",
                    }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#1A1A1A",
                        marginBottom: "0.25rem",
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
                    {"link" in item && item.link && (
                      <Link
                        href={item.link.href}
                        className="inline-block no-underline mt-2"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#C4704B",
                        }}
                      >
                        {item.link.text}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FIX #1: Pré-enquadramento consultoria */}
          <div
            className="p-6 lg:p-8 mb-8 text-left"
            style={{
              backgroundColor: "rgba(27,42,74,0.03)",
              border: "1px solid rgba(27,42,74,0.1)",
            }}
          >
            <h3
              className="mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Una cosa da sapere prima della sessione.
            </h3>
            <p
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "0.9rem",
                color: "#555",
                lineHeight: 1.7,
              }}
            >
              Nell'ultima parte della Masterclass presenterò brevemente come lavoro con le PMI che vogliono andare oltre la diagnosi — con un percorso strutturato di consulenza operativa. Non è un obbligo, né una pressione. Se durante la sessione vede che c'è lavoro da fare insieme, sarà il momento giusto per dirmelo.
            </p>
          </div>

          {/* Giornale — link secondário */}
          <div
            className="p-6"
            style={{
              backgroundColor: "rgba(27,42,74,0.04)",
              border: "1px solid rgba(27,42,74,0.1)",
            }}
          >
            <p
              className="mb-3"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1rem",
                color: "#444",
                lineHeight: 1.6,
              }}
            >
              Mentre aspetta la sessione, legga <strong>Il Giornale dell'IA</strong> — ogni settimana un caso reale di PMI italiana che ha implementato l'IA.
            </p>
            <Link
              href="/giornale"
              className="inline-block no-underline px-6 py-2.5"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FAFAF7",
                backgroundColor: "#1B2A4A",
              }}
            >
              Leggi Il Giornale dell'IA →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer minimal */}
      <footer className="container pb-8">
        <div className="rule-thin mb-6" />
        <p
          className="text-center"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            color: "#999",
          }}
        >
          © {new Date().getFullYear()} Il Consigliere — Tutti i diritti riservati.
        </p>
      </footer>
    </div>
  );
}
