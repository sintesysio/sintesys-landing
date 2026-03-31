import NavBar from "@/components/NavBar";

export default function PrivacyPolicy() {
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
          Informativa sulla Privacy
        </h1>
        <p
          className="mt-3 text-sm"
          style={{ fontFamily: "'Inter', sans-serif", color: "#777" }}
        >
          Ultimo aggiornamento: 31 marzo 2026 &middot; Conforme al Regolamento
          (UE) 2016/679 (GDPR)
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
              1. Titolare del Trattamento
            </h2>
            <p className="leading-relaxed">
              Il titolare del trattamento dei dati personali è <strong>Sintesys.io</strong>,
              con sede operativa in Italia. Per qualsiasi comunicazione relativa alla
              protezione dei dati, è possibile scrivere a{" "}
              <a href="mailto:privacy@sintesys.io" className="text-[#1B2A4A] underline underline-offset-2 hover:text-[#C4704B]">
                privacy@sintesys.io
              </a>.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              2. Dati Raccolti
            </h2>
            <p className="leading-relaxed mb-4">
              Raccogliamo esclusivamente i dati necessari per erogare i nostri servizi
              di consulenza in intelligenza artificiale e trasformazione digitale per le PMI.
              Le categorie di dati trattati includono:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#1B2A4A]">
                    <th className="text-left py-2 pr-4 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>Categoria</th>
                    <th className="text-left py-2 pr-4 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>Esempi</th>
                    <th className="text-left py-2 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>Base Giuridica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 pr-4 font-medium">Dati identificativi</td>
                    <td className="py-3 pr-4">Nome, cognome, email, telefono, ragione sociale</td>
                    <td className="py-3">Consenso / Esecuzione contratto</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">Dati di navigazione</td>
                    <td className="py-3 pr-4">Indirizzo IP, browser, pagine visitate, durata sessione</td>
                    <td className="py-3">Interesse legittimo</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">Dati da piattaforme terze</td>
                    <td className="py-3 pr-4">Profilo pubblico Meta (Facebook/Instagram), dati di interazione</td>
                    <td className="py-3">Consenso</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">Dati aziendali</td>
                    <td className="py-3 pr-4">Settore, fatturato indicativo, numero dipendenti, sfide operative</td>
                    <td className="py-3">Esecuzione contratto</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              3. Finalità del Trattamento
            </h2>
            <p className="leading-relaxed mb-3">
              I dati personali vengono trattati per le seguenti finalità:
            </p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "Erogazione dei servizi di consulenza e audit operativo richiesti.",
                "Invio della newsletter \"Il Giornale dell'IA\" e comunicazioni di marketing previo consenso.",
                "Analisi e miglioramento dell'esperienza di navigazione sul sito.",
                "Adempimento di obblighi legali, fiscali e contabili.",
                "Gestione delle richieste di contatto e assistenza.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#C4704B] font-bold mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              4. Condivisione dei Dati
            </h2>
            <p className="leading-relaxed">
              Non vendiamo, affittiamo o scambiamo i tuoi dati personali con terze parti
              per finalità di marketing. I dati possono essere condivisi esclusivamente con:
            </p>
            <ul className="list-none space-y-2 pl-0 mt-3">
              {[
                "Fornitori di servizi tecnologici (hosting, email marketing, analytics) che agiscono come responsabili del trattamento.",
                "Piattaforme pubblicitarie (Meta, Google) per la gestione delle campagne, nel rispetto delle rispettive informative.",
                "Autorità competenti, qualora richiesto dalla legge.",
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
              5. Cookie e Tecnologie di Tracciamento
            </h2>
            <p className="leading-relaxed">
              Il sito utilizza cookie tecnici necessari al funzionamento e cookie analitici
              (Google Analytics 4) e di profilazione (Meta Pixel) per comprendere il
              comportamento degli utenti e ottimizzare le campagne pubblicitarie. I cookie
              di profilazione vengono installati solo previo consenso dell'utente. È
              possibile gestire le preferenze sui cookie in qualsiasi momento tramite le
              impostazioni del browser.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              6. Conservazione dei Dati
            </h2>
            <p className="leading-relaxed">
              I dati personali vengono conservati per il tempo strettamente necessario al
              raggiungimento delle finalità per cui sono stati raccolti. In particolare:
              i dati di contatto vengono conservati per la durata del rapporto commerciale
              e per i successivi 24 mesi; i dati di navigazione vengono conservati per un
              massimo di 14 mesi; i dati fiscali e contabili vengono conservati per 10 anni,
              come previsto dalla normativa italiana.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              7. I Tuoi Diritti (GDPR — Artt. 15-22)
            </h2>
            <p className="leading-relaxed mb-3">
              In conformità con il Regolamento (UE) 2016/679, hai il diritto di:
            </p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "Accesso: ottenere conferma dell'esistenza dei tuoi dati e riceverne copia.",
                "Rettifica: richiedere la correzione di dati inesatti o incompleti.",
                "Cancellazione: richiedere la cancellazione dei tuoi dati (\"diritto all'oblio\").",
                "Limitazione: richiedere la limitazione del trattamento in determinati casi.",
                "Portabilità: ricevere i tuoi dati in formato strutturato e leggibile da dispositivo automatico.",
                "Opposizione: opporti al trattamento dei tuoi dati per motivi legittimi.",
                "Reclamo: presentare reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#C4704B] font-bold mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              8. Sicurezza dei Dati
            </h2>
            <p className="leading-relaxed">
              Adottiamo misure tecniche e organizzative adeguate per proteggere i dati
              personali da accessi non autorizzati, perdita, distruzione o alterazione.
              Tra queste: crittografia TLS/SSL per tutte le comunicazioni, accesso ai dati
              limitato al personale autorizzato e backup regolari con procedure di disaster
              recovery.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              9. Trasferimento dei Dati Extra-UE
            </h2>
            <p className="leading-relaxed">
              Alcuni dei nostri fornitori di servizi (ad esempio, servizi di hosting e
              analytics) possono trattare i dati al di fuori dell'Unione Europea. In tali
              casi, ci assicuriamo che il trasferimento avvenga nel rispetto delle garanzie
              previste dal GDPR, incluse le Clausole Contrattuali Standard approvate dalla
              Commissione Europea.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              10. Contatti
            </h2>
            <p className="leading-relaxed">
              Per esercitare i tuoi diritti o per qualsiasi domanda relativa al trattamento
              dei tuoi dati personali, puoi contattarci all'indirizzo:
            </p>
            <p className="mt-3 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              <a href="mailto:privacy@sintesys.io" className="text-[#1B2A4A] underline underline-offset-2 hover:text-[#C4704B]">
                privacy@sintesys.io
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
            <a href="/terms-of-service" className="hover:text-[#1B2A4A] transition-colors">Termini di Servizio</a>
            <a href="/data-deletion" className="hover:text-[#1B2A4A] transition-colors">Cancellazione Dati</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
