import NavBar from "@/components/NavBar";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAFAF7" }}>
      <NavBar />
      <main className="container flex-grow py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#1B2A4A]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Informativa sulla Privacy
        </h1>
        
        <div className="prose prose-lg max-w-none text-[#333333]" style={{ fontFamily: "'Inter', sans-serif" }}>
          <p className="mb-4">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">1. Informazioni Generali</h2>
          <p className="mb-4">
            Sintesys.io ("noi", "nostro" o "ci") si impegna a proteggere la tua privacy. Questa Informativa sulla Privacy spiega come raccogliamo, utilizziamo, divulghiamo e salvaguardiamo le tue informazioni quando visiti il nostro sito web e utilizzi i nostri servizi o applicazioni, inclusa la nostra applicazione Meta (Facebook/Instagram).
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">2. Dati che Raccogliamo</h2>
          <p className="mb-4">
            Possiamo raccogliere informazioni su di te in vari modi. Le informazioni che possiamo raccogliere tramite la nostra applicazione o sito web includono:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Dati Personali:</strong> Informazioni identificabili come nome, indirizzo email e numero di telefono, che ci fornisci volontariamente quando ti registri o ci contatti.</li>
            <li className="mb-2"><strong>Dati di Navigazione:</strong> Informazioni che i nostri server raccolgono automaticamente quando accedi al sito, come il tuo indirizzo IP, il tipo di browser e il sistema operativo.</li>
            <li className="mb-2"><strong>Dati dai Social Network:</strong> Informazioni provenienti da piattaforme di social media (come Meta/Facebook) se scegli di collegare il tuo account, incluse le informazioni del tuo profilo pubblico.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">3. Uso delle Informazioni</h2>
          <p className="mb-4">
            Avendo informazioni accurate su di te, possiamo fornirti un'esperienza fluida, efficiente e personalizzata. In particolare, possiamo utilizzare le informazioni raccolte per:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Creare e gestire il tuo account.</li>
            <li className="mb-2">Inviarti comunicazioni di marketing, newsletter e altre informazioni relative ai nostri servizi.</li>
            <li className="mb-2">Migliorare l'efficienza e il funzionamento del nostro sito e delle nostre applicazioni.</li>
            <li className="mb-2">Rispondere alle tue richieste di servizio clienti.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">4. Condivisione delle Informazioni</h2>
          <p className="mb-4">
            Non vendiamo, scambiamo o affittiamo le tue informazioni personali a terzi. Possiamo condividere informazioni generiche aggregate non collegate ad alcuna informazione di identificazione personale con i nostri partner commerciali per le finalità sopra indicate.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">5. Sicurezza dei Dati</h2>
          <p className="mb-4">
            Utilizziamo misure di sicurezza amministrative, tecniche e fisiche per proteggere le tue informazioni personali. Sebbene abbiamo adottato misure ragionevoli per proteggere le informazioni che ci fornisci, tieni presente che nessuna trasmissione di dati su Internet o rete wireless può essere garantita come sicura al 100%.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">6. I Tuoi Diritti (GDPR)</h2>
          <p className="mb-4">
            In conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR), hai il diritto di accedere, rettificare, cancellare o limitare il trattamento dei tuoi dati personali. Puoi esercitare questi diritti contattandoci direttamente.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1B2A4A]">7. Contattaci</h2>
          <p className="mb-4">
            Se hai domande o commenti su questa Informativa sulla Privacy, ti preghiamo di contattarci a:
            <br />
            <strong>Email:</strong> privacy@sintesys.io
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
