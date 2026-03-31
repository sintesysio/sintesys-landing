import NavBar from "@/components/NavBar";

export default function TermsOfService() {
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
          Documento Legale
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold text-[#1B2A4A] leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Termini di Servizio
        </h1>
        <p
          className="mt-3 text-sm"
          style={{ fontFamily: "'Inter', sans-serif", color: "#777" }}
        >
          Ultimo aggiornamento: 31 marzo 2026 &middot; Applicabili a tutti i
          servizi Sintesys.io
        </p>
        <div className="rule-thin mt-6" />
      </header>

      {/* Body */}
      <main className="container flex-grow max-w-4xl mx-auto pb-16">
        <div
          className="text-[#333] space-y-8"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          {/* 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              1. Accettazione dei Termini
            </h2>
            <p className="leading-relaxed">
              Accedendo e utilizzando il sito web <strong>sintesys.io</strong> e i servizi
              offerti da Sintesys.io (di seguito "i Servizi"), l'utente accetta di essere
              vincolato dai presenti Termini di Servizio, dall'Informativa sulla Privacy e
              da tutte le leggi e i regolamenti applicabili. Se non si accettano i presenti
              Termini, si prega di non utilizzare il sito né i Servizi.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              2. Descrizione dei Servizi
            </h2>
            <p className="leading-relaxed">
              Sintesys.io fornisce servizi di consulenza strategica in intelligenza
              artificiale e trasformazione digitale per le Piccole e Medie Imprese (PMI)
              italiane. I Servizi includono, a titolo esemplificativo e non esaustivo:
            </p>
            <ul className="list-none space-y-2 pl-0 mt-3">
              {[
                "Audit operativi e mappatura dei processi aziendali (\"Settimana Zero\").",
                "Consulenza strategica e roadmap di implementazione IA (\"Roadmap 90 Giorni\").",
                "Newsletter editoriale \"Il Giornale dell'IA\" con contenuti informativi sul settore.",
                "Materiali formativi e guide, inclusa la \"Guida Transizione 5.0\".",
                "Sviluppo e implementazione di soluzioni software basate sull'intelligenza artificiale.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#C4704B] font-bold mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              3. Registrazione e Account
            </h2>
            <p className="leading-relaxed">
              Alcuni Servizi possono richiedere la creazione di un account o la
              registrazione tramite piattaforme terze (ad esempio, Meta/Facebook). L'utente
              è responsabile della veridicità delle informazioni fornite e della
              riservatezza delle proprie credenziali di accesso. Qualsiasi attività
              effettuata tramite il proprio account è sotto la responsabilità dell'utente.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              4. Obblighi dell'Utente
            </h2>
            <p className="leading-relaxed mb-3">
              L'utente si impegna a:
            </p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "Utilizzare il sito e i Servizi esclusivamente per scopi leciti e conformi ai presenti Termini.",
                "Non tentare di ottenere accesso non autorizzato ai nostri sistemi, reti o dati.",
                "Non riprodurre, distribuire o modificare i contenuti del sito senza autorizzazione scritta.",
                "Fornire informazioni veritiere e aggiornate durante la registrazione e l'utilizzo dei Servizi.",
                "Non utilizzare i Servizi per attività che possano danneggiare Sintesys.io o terze parti.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#C4704B] font-bold mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              5. Integrazione con Piattaforme Terze
            </h2>
            <p className="leading-relaxed">
              I nostri Servizi possono integrarsi con applicazioni e piattaforme di terze
              parti, tra cui Meta (Facebook/Instagram), Google e Mailchimp. L'utilizzo di
              tali integrazioni è soggetto ai termini e alle politiche sulla privacy delle
              rispettive piattaforme. Sintesys.io non è responsabile per le pratiche, i
              contenuti o la disponibilità di servizi di terze parti.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              6. Proprietà Intellettuale
            </h2>
            <p className="leading-relaxed">
              Tutti i contenuti presenti sul sito — inclusi testi, grafica, loghi, immagini,
              software, metodologie e materiali formativi — sono di proprietà esclusiva di
              Sintesys.io e sono protetti dalle leggi italiane e internazionali sul diritto
              d'autore e sulla proprietà intellettuale. È vietata qualsiasi riproduzione,
              distribuzione o creazione di opere derivate senza il previo consenso scritto
              di Sintesys.io.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              7. Servizi di Consulenza e Risultati
            </h2>
            <p className="leading-relaxed">
              I servizi di consulenza offerti da Sintesys.io sono basati sulle migliori
              pratiche del settore e sull'esperienza professionale del team. Tuttavia, i
              risultati specifici possono variare in base a molteplici fattori, tra cui le
              condizioni di mercato, le risorse disponibili e l'implementazione da parte
              del cliente. Sintesys.io non garantisce risultati economici specifici
              derivanti dall'utilizzo dei Servizi.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              8. Limitazione di Responsabilità
            </h2>
            <p className="leading-relaxed">
              Nella misura massima consentita dalla legge applicabile, Sintesys.io non sarà
              responsabile per eventuali danni diretti, indiretti, incidentali,
              consequenziali o speciali derivanti dall'uso o dall'impossibilità di
              utilizzare i Servizi o il sito web. La responsabilità complessiva di
              Sintesys.io nei confronti dell'utente non potrà in alcun caso superare
              l'importo effettivamente pagato dall'utente per i Servizi nei 12 mesi
              precedenti.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              9. Modifiche ai Termini
            </h2>
            <p className="leading-relaxed">
              Sintesys.io si riserva il diritto di modificare i presenti Termini in
              qualsiasi momento. Le modifiche entreranno in vigore al momento della
              pubblicazione sul sito. L'uso continuato dei Servizi dopo la pubblicazione
              delle modifiche costituisce accettazione dei nuovi Termini. In caso di
              modifiche sostanziali, ne daremo comunicazione tramite email o avviso sul
              sito.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              10. Recesso e Risoluzione
            </h2>
            <p className="leading-relaxed">
              L'utente può cessare l'utilizzo dei Servizi in qualsiasi momento. Sintesys.io
              si riserva il diritto di sospendere o terminare l'accesso ai Servizi in caso
              di violazione dei presenti Termini, con preavviso ragionevole salvo casi di
              urgenza. Le disposizioni relative a proprietà intellettuale, limitazione di
              responsabilità e legge applicabile sopravvivono alla risoluzione.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              11. Legge Applicabile e Foro Competente
            </h2>
            <p className="leading-relaxed">
              I presenti Termini sono regolati e interpretati in conformità con le leggi
              della Repubblica Italiana. Per qualsiasi controversia derivante dai presenti
              Termini o dall'utilizzo dei Servizi, sarà competente in via esclusiva il Foro
              di Milano, salvo diversa disposizione inderogabile di legge a favore del
              consumatore.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              12. Contatti
            </h2>
            <p className="leading-relaxed">
              Per qualsiasi domanda relativa ai presenti Termini di Servizio, è possibile
              contattarci all'indirizzo:
            </p>
            <p className="mt-3 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              <a href="mailto:legal@sintesys.io" className="text-[#1B2A4A] underline underline-offset-2 hover:text-[#C4704B]">
                legal@sintesys.io
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
            <a href="/data-deletion" className="hover:text-[#1B2A4A] transition-colors">Cancellazione Dati</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
