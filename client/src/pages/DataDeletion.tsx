import NavBar from "@/components/NavBar";

export default function DataDeletion() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAFAF7" }}>
      <NavBar />
      <main className="container flex-grow py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#1B2A4A]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Cancellazione dei Dati Utente
        </h1>
        
        <div className="prose prose-lg max-w-none text-[#333333]" style={{ fontFamily: "'Inter', sans-serif" }}>
          <p className="mb-6">
            In conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR) e le politiche degli sviluppatori di Meta (Facebook/Instagram), hai il diritto di richiedere la completa cancellazione dei tuoi dati personali dai nostri sistemi e dalle nostre applicazioni.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#1B2A4A]">Come richiedere la cancellazione dei dati:</h2>
            
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Inviaci un'email:</strong> Invia una richiesta di cancellazione dei dati all'indirizzo <a href="mailto:privacy@sintesys.io" className="text-blue-600 hover:underline">privacy@sintesys.io</a>.
              </li>
              <li>
                <strong>Dettagli richiesti:</strong> Assicurati di inviare l'email dall'indirizzo associato al tuo account o includi le informazioni necessarie per identificare il tuo profilo.
              </li>
              <li>
                <strong>Oggetto dell'email:</strong> Usa "Richiesta Cancellazione Dati" come oggetto dell'email per accelerare il processo.
              </li>
            </ol>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">Rimuovere l'accesso tramite Facebook/Meta</h2>
          <p className="mb-4">
            Se hai collegato il tuo account Facebook/Instagram alla nostra applicazione e desideri rimuovere l'accesso, puoi farlo direttamente dalle impostazioni del tuo account Meta:
          </p>
          <ol className="list-decimal pl-6 space-y-2 mb-8">
            <li>Vai sul tuo profilo Facebook e clicca su <strong>Impostazioni e privacy</strong> &gt; <strong>Impostazioni</strong>.</li>
            <li>Nel menu a sinistra, clicca su <strong>App e siti web</strong>.</li>
            <li>Trova l'app <strong>Sintesys.io</strong> nella lista.</li>
            <li>Clicca su <strong>Rimuovi</strong>.</li>
          </ol>

          <p className="text-sm text-gray-500 mt-12">
            Elaboreremo la tua richiesta entro 30 giorni dalla ricezione. Ti preghiamo di notare che alcune informazioni potrebbero essere conservate per obblighi legali o fiscali.
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
