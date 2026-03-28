/**
 * Contattaci — Contact page with multi-step Typeform-style qualification form
 * Collects qualified leads with 4 sections: Profile, Pain Points, Tech Maturity, Urgency
 * Stores in separate qualifiedLeads table
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar";
import { trpc } from "@/lib/trpc";

const BRAIN_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/brain-icon_a74d4c28.png";

const TOTAL_STEPS = 5; // Contact info + 4 qualification sections

interface FormState {
  // Step 0: Contact info
  name: string;
  email: string;
  phone: string;
  companyName: string;
  // Step 1: Profile & Segmentation
  revenue: string;
  employees: string;
  sector: string;
  // Step 2: Pain Diagnosis
  mainObstacle: string;
  manualHoursPerWeek: string;
  dataLocation: string;
  // Step 3: Tech Maturity
  currentTools: string;
  usesAI: string;
  aiDetails: string;
  // Step 4: Urgency & Authority
  priority: string;
  isDecisionMaker: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  revenue: "",
  employees: "",
  sector: "",
  mainObstacle: "",
  manualHoursPerWeek: "",
  dataLocation: "",
  currentTools: "",
  usesAI: "",
  aiDetails: "",
  priority: "",
  isDecisionMaker: "",
};

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            color: "#999",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Passo {current + 1} di {total}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            color: "#999",
          }}
        >
          {Math.round(pct)}%
        </span>
      </div>
      <div className="w-full h-1" style={{ backgroundColor: "oklch(0.90 0.003 60)" }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: "#1B2A4A" }}
        />
      </div>
    </div>
  );
}

function RadioOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-4 transition-all duration-200"
      style={{
        fontFamily: "'Source Serif 4', serif",
        fontSize: "0.95rem",
        color: selected ? "#1B2A4A" : "#333",
        backgroundColor: selected ? "oklch(0.25 0.05 260 / 0.06)" : "#fff",
        border: selected ? "2px solid #1B2A4A" : "1px solid oklch(0.85 0.005 60)",
        fontWeight: selected ? 600 : 400,
      }}
    >
      <span className="flex items-center gap-3">
        <span
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
          style={{
            border: selected ? "2px solid #1B2A4A" : "1.5px solid #ccc",
            borderRadius: "50%",
          }}
        >
          {selected && (
            <span
              className="w-2.5 h-2.5 block"
              style={{ backgroundColor: "#1B2A4A", borderRadius: "50%" }}
            />
          )}
        </span>
        {label}
      </span>
    </button>
  );
}

function StepLabel({ text }: { text: string }) {
  return (
    <p
      className="uppercase tracking-[0.15em] mb-2"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.65rem",
        color: "#999",
        borderLeft: "3px solid #1B2A4A",
        paddingLeft: "0.75rem",
      }}
    >
      {text}
    </p>
  );
}

function StepTitle({ text }: { text: string }) {
  return (
    <h2
      className="mb-6"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
        fontWeight: 700,
        color: "#1A1A1A",
        lineHeight: 1.2,
      }}
    >
      {text}
    </h2>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="mb-4">
      <label
        className="block mb-1.5 uppercase tracking-[0.1em]"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.65rem",
          color: "#999",
        }}
      >
        {label} {required && <span style={{ color: "#1B2A4A" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 transition-colors"
        style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: "0.95rem",
          color: "#1A1A1A",
          backgroundColor: "#fff",
          border: "1px solid oklch(0.85 0.005 60)",
          outline: "none",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
        onBlur={(e) => (e.target.style.borderColor = "oklch(0.85 0.005 60)")}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label
        className="block mb-1.5 uppercase tracking-[0.1em]"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.65rem",
          color: "#999",
        }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 transition-colors resize-none"
        style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: "0.95rem",
          color: "#1A1A1A",
          backgroundColor: "#fff",
          border: "1px solid oklch(0.85 0.005 60)",
          outline: "none",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
        onBlur={(e) => (e.target.style.borderColor = "oklch(0.85 0.005 60)")}
      />
    </div>
  );
}

export default function Contattaci() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submitLead = trpc.qualifiedLeads.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err: { message?: string }) => setErrorMsg(err.message || "Errore. Riprova."),
  });

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return form.name.trim() !== "" && form.email.trim() !== "";
      case 1:
        return form.revenue !== "" && form.employees !== "" && form.sector !== "";
      case 2:
        return form.mainObstacle !== "" && form.dataLocation !== "";
      case 3:
        return form.usesAI !== "";
      case 4:
        return form.priority !== "" && form.isDecisionMaker !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      // Submit
      setErrorMsg("");
      submitLead.mutate({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        companyName: form.companyName || undefined,
        revenue: form.revenue,
        employees: form.employees,
        sector: form.sector,
        mainObstacle: form.mainObstacle,
        manualHoursPerWeek: form.manualHoursPerWeek || undefined,
        dataLocation: form.dataLocation,
        currentTools: form.currentTools || undefined,
        usesAI: form.usesAI,
        aiDetails: form.aiDetails || undefined,
        priority: form.priority,
        isDecisionMaker: form.isDecisionMaker,
      });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
        <NavBar />
        <div className="container py-20 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rule-thick mb-8" />
            <p
              className="uppercase tracking-[0.2em] mb-3"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}
            >
              Audit Operativo Rapido
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#1B2A4A",
                lineHeight: 1.2,
                marginBottom: "1.5rem",
              }}
            >
              Grazie, {form.name.split(" ")[0]}.
            </h2>
            <p
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1.05rem",
                color: "#333",
                lineHeight: 1.75,
                marginBottom: "1rem",
              }}
            >
              Con base nelle tue risposte, la Sintesys.io preparerà un <strong>diagnóstico preliminare</strong> su dove la tua azienda sta perdendo efficienza e dove l'Intelligenza Artificiale può generare il massimo impatto.
            </p>
            <p
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1.05rem",
                color: "#333",
                lineHeight: 1.75,
              }}
            >
              Ti contatteremo entro <strong>48 ore lavorative</strong> per discutere il tuo piano personalizzato.
            </p>
            <div className="rule-thick mt-8" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      <NavBar />

      {/* Page header */}
      <header className="container pt-10 pb-2">
        <div className="text-center">
          <p
            className="uppercase tracking-[0.2em] mb-2"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}
          >
            Audit Operativo Rapido
          </p>
          <h1
            className="leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
              fontWeight: 900,
              color: "#1B2A4A",
              letterSpacing: "-0.02em",
            }}
          >
            Scopri Dove la Tua Azienda Sta Perdendo Efficienza
          </h1>
          <p
            className="mt-3 max-w-xl mx-auto"
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1rem",
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            Rispondi a poche domande strategiche e ricevi un'analisi preliminare personalizzata — senza impegno.
          </p>
        </div>
      </header>

      {/* Form container */}
      <section className="container py-8 max-w-2xl mx-auto">
        <div
          className="p-6 md:p-10"
          style={{
            backgroundColor: "#fff",
            border: "1px solid oklch(0.85 0.005 60)",
          }}
        >
          <ProgressBar current={step} total={TOTAL_STEPS} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* ─── Step 0: Contact Info ─── */}
              {step === 0 && (
                <div>
                  <StepLabel text="Informazioni di Contatto" />
                  <StepTitle text="Iniziamo con i tuoi dati." />
                  <InputField label="Nome e Cognome" value={form.name} onChange={(v) => update("name", v)} placeholder="es. Marco Rossi" required />
                  <InputField label="Email Aziendale" value={form.email} onChange={(v) => update("email", v)} type="email" placeholder="es. marco@azienda.it" required />
                  <InputField label="Telefono" value={form.phone} onChange={(v) => update("phone", v)} type="tel" placeholder="es. +39 333 1234567" />
                  <InputField label="Nome dell'Azienda" value={form.companyName} onChange={(v) => update("companyName", v)} placeholder="es. Rossi S.r.l." />
                </div>
              )}

              {/* ─── Step 1: Profile & Segmentation ─── */}
              {step === 1 && (
                <div>
                  <StepLabel text="Profilo e Segmentazione" />
                  <StepTitle text="Qual è la dimensione della tua azienda?" />

                  <p className="mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Fatturato mensile medio *
                  </p>
                  <div className="space-y-2 mb-6">
                    {["Sotto €150k", "€150k - €500k", "€500k - €1M", "Sopra €1M"].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.revenue === opt} onClick={() => update("revenue", opt)} />
                    ))}
                  </div>

                  <p className="mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Numero di collaboratori *
                  </p>
                  <div className="space-y-2 mb-6">
                    {["5 - 10", "10 - 30", "Oltre 30"].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.employees === opt} onClick={() => update("employees", opt)} />
                    ))}
                  </div>

                  <p className="mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Settore *
                  </p>
                  <div className="space-y-2">
                    {["Industria", "Commercio", "Servizi", "Istruzione", "Altro"].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.sector === opt} onClick={() => update("sector", opt)} />
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Step 2: Pain Diagnosis ─── */}
              {step === 2 && (
                <div>
                  <StepLabel text="Diagnosi delle Criticità" />
                  <StepTitle text="Qual è il maggiore ostacolo alla crescita?" />

                  <div className="space-y-2 mb-6">
                    {[
                      "Processi manuali e lenti",
                      "Disorganizzazione dei dati e perdita di informazioni",
                      "Team sovraccaricato con attività ripetitive",
                      "Mancanza di visibilità su ricavi e costi in tempo reale",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.mainObstacle === opt} onClick={() => update("mainObstacle", opt)} />
                    ))}
                  </div>

                  <InputField
                    label="Ore settimanali in attività manuali automatizzabili"
                    value={form.manualHoursPerWeek}
                    onChange={(v) => update("manualHoursPerWeek", v)}
                    placeholder="es. 15 ore"
                  />

                  <p className="mb-3 mt-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Dove si trovano i dati della tua azienda oggi? *
                  </p>
                  <div className="space-y-2">
                    {[
                      "Fogli di calcolo sparsi e WhatsApp",
                      "Software obsoleto senza integrazione",
                      "Carta o memoria del team",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.dataLocation === opt} onClick={() => update("dataLocation", opt)} />
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Step 3: Tech Maturity ─── */}
              {step === 3 && (
                <div>
                  <StepLabel text="Maturità Tecnologica" />
                  <StepTitle text="Quali strumenti utilizzate oggi?" />

                  <TextAreaField
                    label="Strumenti attuali (CRM, ERP, Google Workspace, ecc.)"
                    value={form.currentTools}
                    onChange={(v) => update("currentTools", v)}
                    placeholder="es. Utilizziamo SAP per la contabilità, Google Workspace per le email..."
                  />

                  <p className="mb-3 mt-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    La tua azienda utilizza già soluzioni di IA o automazione? *
                  </p>
                  <div className="space-y-2 mb-4">
                    {["Sì", "No"].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.usesAI === opt} onClick={() => update("usesAI", opt)} />
                    ))}
                  </div>

                  {form.usesAI === "Sì" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <InputField
                        label="Quali soluzioni di IA utilizzate?"
                        value={form.aiDetails}
                        onChange={(v) => update("aiDetails", v)}
                        placeholder="es. ChatGPT per il supporto clienti, automazioni con Zapier..."
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {/* ─── Step 4: Urgency & Authority ─── */}
              {step === 4 && (
                <div>
                  <StepLabel text="Urgenza e Autorità Decisionale" />
                  <StepTitle text="Quanto è urgente per te innovare?" />

                  <p className="mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Priorità di implementazione *
                  </p>
                  <div className="space-y-2 mb-6">
                    {[
                      "Immediata (prossimi 30 giorni)",
                      "A breve termine (90 giorni)",
                      "Sto solo esplorando le opzioni",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.priority === opt} onClick={() => update("priority", opt)} />
                    ))}
                  </div>

                  <p className="mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Sei il responsabile finale delle decisioni di investimento in tecnologia? *
                  </p>
                  <div className="space-y-2">
                    {["Sì", "No"].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.isDecisionMaker === opt} onClick={() => update("isDecisionMaker", opt)} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Error message */}
          {errorMsg && (
            <p className="mt-4 text-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#c00" }}>
              {errorMsg}
            </p>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 text-xs tracking-[0.1em] uppercase transition-colors"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "#666",
                  border: "1px solid oklch(0.85 0.005 60)",
                  backgroundColor: "transparent",
                  fontWeight: 500,
                }}
              >
                &larr; Indietro
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed() || submitLead.isPending}
              className="px-6 py-2.5 text-xs tracking-[0.1em] uppercase transition-all"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: canProceed() ? "#FAFAF7" : "#999",
                backgroundColor: canProceed() ? "#1B2A4A" : "oklch(0.90 0.003 60)",
                fontWeight: 600,
                opacity: submitLead.isPending ? 0.6 : 1,
              }}
            >
              {submitLead.isPending
                ? "Invio in corso..."
                : step === TOTAL_STEPS - 1
                ? "Invia Audit"
                : "Avanti \u2192"}
            </button>
          </div>
        </div>

        {/* Privacy note */}
        <p
          className="text-center mt-4"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            color: "#bbb",
          }}
        >
          I tuoi dati sono protetti e trattati in conformità al GDPR (Reg. UE 2016/679).
          <br />
          Non condivideremo mai le tue informazioni con terze parti.
        </p>
      </section>

      {/* Footer */}
      <footer className="container pb-8 mt-8" role="contentinfo">
        <div className="rule-thick mb-4" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <img src={BRAIN_ICON} alt="Sintesys.io" className="h-6 w-6 rounded-full opacity-60" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#999" }}>
              &copy; {new Date().getFullYear()} Sintesys.io — Tutti i diritti riservati
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
