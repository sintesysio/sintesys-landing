import NavBar from "@/components/NavBar";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAFAF7" }}>
      <NavBar />
      <main className="container flex-grow py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#1B2A4A]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Termini di Servizio
        </h1>
        
        <div className="prose prose-lg max-w-none text-[#333333]" style={{ fontFamily: "'Inter', sans-serif" }}>
          <p className="mb-4">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">1. Accettazione dei Termini</h2>
          <p className="mb-4">
            Accedendo e utilizzando il sito web Sintesys.io e i nostri servizi, accetti di essere vincolato dai presenti Termini di Servizio e da tutte le leggi e i regolamenti applicabili. Se non sei d'accordo con uno qualsiasi di questi termini, sei pregato di non utilizzare il nostro sito o i nostri servizi.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">2. Uso del Servizio</h2>
          <p className="mb-4">
            Sintesys.io fornisce servizi di consulenza in intelligenza artificiale e trasformazione digitale per le PMI. I contenuti presenti sul sito sono forniti solo a scopo informativo generale.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Non devi utilizzare il sito per scopi illegali o non autorizzati.</li>
            <li className="mb-2">Non devi tentare di ottenere accesso non autorizzato ai nostri sistemi o reti.</li>
            <li className="mb-2">Sei responsabile di mantenere la riservatezza delle informazioni del tuo account.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">3. Integrazione con Applicazioni di Terze Parti</h2>
          <p className="mb-4">
            I nostri servizi possono integrarsi con applicazioni di terze parti, come Meta (Facebook/Instagram). L'utilizzo di tali integrazioni è soggetto ai termini e alle politiche sulla privacy di tali terze parti. Non siamo responsabili per le pratiche o i contenuti di queste piattaforme.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">4. Proprietà Intellettuale</h2>
          <p className="mb-4">
            Tutto il contenuto, il design, la grafica, il testo e gli altri materiali presenti sul sito sono di proprietà di Sintesys.io e sono protetti dalle leggi sul copyright e sulla proprietà intellettuale. Non è consentito riprodurre, distribuire o creare opere derivate senza il nostro esplicito consenso scritto.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">5. Limitazione di Responsabilità</h2>
          <p className="mb-4">
            Sintesys.io non sarà responsabile per eventuali danni diretti, indiretti, incidentali, consequenziali o speciali derivanti dall'uso o dall'impossibilità di utilizzare i nostri servizi o il nostro sito web.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">6. Modifiche ai Termini</h2>
          <p className="mb-4">
            Ci riserviamo il diritto di modificare o sostituire i presenti Termini in qualsiasi momento. Le modifiche entreranno in vigore immediatamente dopo la pubblicazione sul sito. L'uso continuato del servizio dopo tali modifiche costituisce l'accettazione dei nuovi Termini.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">7. Legge Applicabile</h2>
          <p className="mb-4">
            Questi Termini sono regolati e interpretati in conformità con le leggi italiane. Qualsiasi controversia derivante da questi Termini sarà soggetta alla giurisdizione esclusiva dei tribunali italiani.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">8. Contatti</h2>
          <p className="mb-4">
            Per qualsiasi domanda riguardante i presenti Termini di Servizio, ti preghiamo di contattarci a:
            <br />
            <strong>Email:</strong> legal@sintesys.io
          </p>
        </div>
      </main>
      
      <footer className="container pb-8 mt-auto" role="contentinfo">
        <div className="rule-thin mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}>
            © {new Date().getFullYear()} Sintesys.io — Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
}
