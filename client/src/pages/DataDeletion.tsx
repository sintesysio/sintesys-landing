import NavBar from "@/components/NavBar";

export default function DataDeletion() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <NavBar />

      {/* Masthead */}
      <header className="container max-w-4xl mx-auto pt-10 pb-6">
        <div className="rule-thick mb-4" />
        <p
          className="text-xs tracking-[0.25em] uppercase mb-2"
          style={{ fontFamily: "'Inter', sans-serif", color: "#999" }}
        >
          Documento Legale &middot; GDPR Art. 17
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold text-[#1B2A4A] leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Cancellazione dei Dati
        </h1>
        <p
          className="mt-3 text-sm"
          style={{ fontFamily: "'Inter', sans-serif", color: "#777" }}
        >
          Ultimo aggiornamento: 31 marzo 2026 &middot; Diritto all'oblio ai
          sensi del Regolamento (UE) 2016/679
        </p>
        <div className="rule-thin mt-6" />
      </header>

      {/* Body */}
      <main className="container flex-grow max-w-4xl mx-auto pb-16">
        <div
          className="text-[#333] space-y-8"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          {/* Intro */}
          <section>
            <p className="leading-relaxed text-lg">
              In conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR)
              e le politiche degli sviluppatori di Meta (Facebook/Instagram), hai il pieno
              diritto di richiedere la cancellazione completa dei tuoi dati personali dai
              nostri sistemi e dalle nostre applicazioni. Prendiamo questo diritto molto
              seriamente.
            </p>
          </section>

          {/* Come richiedere */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Come Richiedere la Cancellazione
            </h2>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-5">
                <div
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: "#1B2A4A", fontFamily: "'Inter', sans-serif" }}
                >
                  01
                </div>
                <div>
                  <h3 className="font-semibold text-[#1B2A4A] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Invia la Richiesta
                  </h3>
                  <p className="leading-relaxed">
                    Scrivi un'email a{" "}
                    <a href="mailto:privacy@sintesys.io" className="text-[#1B2A4A] underline underline-offset-2 hover:text-[#C4704B]">
                      privacy@sintesys.io
                    </a>{" "}
                    con oggetto <strong>"Richiesta Cancellazione Dati"</strong>. Utilizza
                    l'indirizzo email associato al tuo account per una verifica rapida.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-5">
                <div
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: "#1B2A4A", fontFamily: "'Inter', sans-serif" }}
                >
                  02
                </div>
                <div>
                  <h3 className="font-semibold text-[#1B2A4A] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Verifica dell'Identità
                  </h3>
                  <p className="leading-relaxed">
                    Potremmo chiederti di confermare la tua identità per proteggere i tuoi
                    dati da richieste non autorizzate. Includi nella richiesta il tuo nome
                    completo e, se applicabile, la ragione sociale della tua azienda.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-5">
                <div
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: "#1B2A4A", fontFamily: "'Inter', sans-serif" }}
                >
                  03
                </div>
                <div>
                  <h3 className="font-semibold text-[#1B2A4A] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Elaborazione e Conferma
                  </h3>
                  <p className="leading-relaxed">
                    Elaboreremo la tua richiesta entro <strong>30 giorni</strong> dalla
                    ricezione, come previsto dal GDPR. Riceverai una conferma via email al
                    completamento della cancellazione.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Dati cancellati */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quali Dati Vengono Cancellati
            </h2>
            <p className="leading-relaxed mb-4">
              La cancellazione include la rimozione completa di:
            </p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "Dati identificativi (nome, email, telefono, ragione sociale).",
                "Dati di navigazione e interazione con il sito.",
                "Dati raccolti tramite piattaforme terze (Meta, Google).",
                "Iscrizione alla newsletter \"Il Giornale dell'IA\" e preferenze di comunicazione.",
                "Dati aziendali forniti durante audit o consulenze.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#C4704B] font-bold mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Eccezioni */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Eccezioni alla Cancellazione
            </h2>
            <p className="leading-relaxed">
              Ai sensi dell'Art. 17(3) del GDPR, alcuni dati potrebbero essere conservati
              anche dopo la richiesta di cancellazione, qualora necessari per:
              l'adempimento di obblighi legali, fiscali o contabili previsti dalla normativa
              italiana; l'accertamento, l'esercizio o la difesa di un diritto in sede
              giudiziaria; motivi di interesse pubblico nel settore della sanità pubblica.
              In tali casi, sarai informato sui dati conservati e sulla relativa base
              giuridica.
            </p>
          </section>

          {/* Rimuovere accesso Meta */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Rimuovere l'Accesso tramite Meta
            </h2>
            <p className="leading-relaxed mb-4">
              Se hai collegato il tuo account Facebook o Instagram alla nostra applicazione
              e desideri revocare l'accesso, puoi farlo direttamente dalle impostazioni del
              tuo account Meta:
            </p>
            <div className="space-y-3">
              {[
                "Accedi al tuo profilo Facebook e vai su Impostazioni e privacy > Impostazioni.",
                "Nel menu a sinistra, seleziona App e siti web.",
                "Trova l'app Sintesys.io nella lista delle applicazioni collegate.",
                "Clicca su Rimuovi per revocare l'accesso e richiedere la cancellazione dei dati.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold text-[#1B2A4A] border border-[#1B2A4A]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contatti */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contatti
            </h2>
            <p className="leading-relaxed">
              Per qualsiasi domanda relativa alla cancellazione dei tuoi dati o per
              esercitare i tuoi diritti ai sensi del GDPR, puoi contattarci all'indirizzo:
            </p>
            <p className="mt-3 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              <a href="mailto:privacy@sintesys.io" className="text-[#1B2A4A] underline underline-offset-2 hover:text-[#C4704B]">
                privacy@sintesys.io
              </a>
            </p>
            <p className="mt-4 text-sm" style={{ color: "#777" }}>
              Puoi inoltre presentare reclamo al Garante per la Protezione dei Dati
              Personali:{" "}
              <a
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1B2A4A] underline underline-offset-2 hover:text-[#C4704B]"
              >
                www.garanteprivacy.it
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="container max-w-4xl mx-auto pb-8 mt-auto" role="contentinfo">
        <div className="rule-thin mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}>
            &copy; {new Date().getFullYear()} Sintesys.io &mdash; Tutti i diritti riservati.
          </p>
          <div className="flex gap-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}>
            <a href="/privacy-policy" className="hover:text-[#1B2A4A] transition-colors">Informativa Privacy</a>
            <a href="/terms-of-service" className="hover:text-[#1B2A4A] transition-colors">Termini di Servizio</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
