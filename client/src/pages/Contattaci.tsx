/**
 * Contattaci — Contact page with multi-step Typeform-style qualification form
 * Collects qualified leads with 5 sections: Contact, Profile, Pain Points, Tech/Governance, Urgency
 * Questions designed around Italian SME (PMI) pain points and decision-making patterns
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar";
import SEOHead from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";
import { trackLeadQualified, trackFormView } from "@/lib/tracking";

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
  // Step 2: Pain Diagnosis (Italian PMI specific)
  mainObstacle: string;
  dataLocation: string;
  cashFlowChallenge: string;
  delegationChallenge: string;
  // Step 3: Tech Maturity & Governance
  currentTools: string;
  usesAI: string;
  aiDetails: string;
  shadowAIConcern: string;
  // Step 4: Urgency, Succession & Authority
  priority: string;
  successionConcern: string;
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
  dataLocation: "",
  cashFlowChallenge: "",
  delegationChallenge: "",
  currentTools: "",
  usesAI: "",
  aiDetails: "",
  shadowAIConcern: "",
  priority: "",
  successionConcern: "",
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

function QuestionLabel({ text }: { text: string }) {
  return (
    <p
      className="mb-3 mt-4"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.7rem",
        color: "#999",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}
    >
      {text}
    </p>
  );
}

export default function Contattaci() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    trackFormView("contattaci_qualification_form");
  }, []);

  const submitLead = trpc.qualifiedLeads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      trackLeadQualified({
        name: form.name,
        email: form.email,
        sector: form.sector,
        source: "contattaci",
        revenue: form.revenue,
        employees: form.employees,
      });
    },
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
        dataLocation: form.dataLocation,
        cashFlowChallenge: form.cashFlowChallenge || undefined,
        delegationChallenge: form.delegationChallenge || undefined,
        currentTools: form.currentTools || undefined,
        usesAI: form.usesAI,
        aiDetails: form.aiDetails || undefined,
        shadowAIConcern: form.shadowAIConcern || undefined,
        priority: form.priority,
        successionConcern: form.successionConcern || undefined,
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
        <SEOHead
        title="Contatti \& Conversazione Strategica — Sintesys.io"
        description="Compili il questionario per parlare con Lamberto Grinover. Risposta entro 24h."
        path="/contattaci"
      />
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
              Prossimo Passo
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
              Perfetto, {form.name.split(" ")[0]}. Ci siamo.
            </h2>
            <p
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1.05rem",
                color: "#333",
                lineHeight: 1.75,
                marginBottom: "1.5rem",
              }}
            >
              <strong>Lamberto Grinover</strong> analizzerà personalmente il profilo della Sua azienda
              e la contatterà per una <strong>conversazione strategica di 30 minuti</strong> dedicata
              alla sua realtà. Nessun venditore, nessun pitch — solo analisi concreta.
            </p>
            <div
              className="p-6 mb-6"
              style={{
                backgroundColor: "oklch(0.25 0.05 260 / 0.04)",
                border: "1px solid oklch(0.25 0.05 260 / 0.12)",
              }}
            >
              <p
                className="uppercase tracking-[0.1em] mb-3"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  color: "#1B2A4A",
                  fontWeight: 600,
                }}
              >
                Cosa succede ora
              </p>
              <div className="space-y-3">
                {[
                  { step: "1", text: "Entro 24 ore: Lamberto analizza il Suo profilo aziendale" },
                  { step: "2", text: "Entro 48 ore: riceverà un'email per fissare i 30 minuti" },
                  { step: "3", text: "Nella sessione: report personalizzato con 3+ opportunità concrete di risparmio" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#FAFAF7",
                        backgroundColor: "#1B2A4A",
                      }}
                    >
                      {item.step}
                    </span>
                    <p
                      style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "0.95rem",
                        color: "#333",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p
              className="mb-6"
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "0.9rem",
                color: "#666",
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
            >
              Controlli la Sua casella di posta (anche lo spam) — riceverai un'email di conferma
              da <strong>commerciale@sintesys.info</strong> nei prossimi minuti.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 text-xs tracking-[0.15em] uppercase transition-all"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#FAFAF7",
                backgroundColor: "#1B2A4A",
                fontWeight: 600,
              }}
            >
              Torna alla Prima Pagina
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      <SEOHead
        title="Contatti \& Conversazione Strategica — Sintesys.io"
        description="Compili il questionario per parlare con Lamberto Grinover. Risposta entro 24h."
        path="/contattaci"
      />
      <NavBar />

      {/* Header */}
      <section className="container pt-10 pb-4 max-w-2xl mx-auto">
        <div className="rule-thick mb-6" />
        <p
          className="uppercase tracking-[0.2em] mb-2 text-center"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#999" }}
        >
          Conversazione Strategica
        </p>
        <h1
          className="text-center mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 700,
            color: "#1B2A4A",
            lineHeight: 1.15,
          }}
        >
          Parli con Lamberto. Scopriamo insieme dove intervenire.
        </h1>
        <p
          className="text-center mb-8"
          style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: "1rem",
            color: "#666",
            lineHeight: 1.6,
          }}
        >
          30 minuti per capire se Sintesys può davvero fare la differenza nella sua azienda.{" "}
          <strong style={{ color: "#1B2A4A" }}>Posti limitati ogni mese — accettiamo solo PMI con almeno 10 dipendenti.</strong>
        </p>
      </section>

      {/* Form */}
      <section className="container max-w-xl mx-auto pb-16">
        <ProgressBar current={step} total={TOTAL_STEPS} />

        <div className="min-h-[380px]">
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
                  <StepLabel text="Chi sei?" />
                  <StepTitle text="Presentati. Nessuna formalità." />
                  <InputField label="Nome e Cognome" value={form.name} onChange={(v) => update("name", v)} placeholder="es. Marco Rossi" required />
                  <InputField label="Email Aziendale" value={form.email} onChange={(v) => update("email", v)} type="email" placeholder="es. marco@azienda.it" required />
                  <InputField label="Telefono" value={form.phone} onChange={(v) => update("phone", v)} type="tel" placeholder="es. +39 333 1234567" />
                  <InputField label="Nome dell'Azienda" value={form.companyName} onChange={(v) => update("companyName", v)} placeholder="es. Rossi S.r.l." />
                </div>
              )}

              {/* ─── Step 1: Profile & Segmentation ─── */}
              {step === 1 && (
                <div>
                  <StepLabel text="La Sua azienda" />
                  <StepTitle text="Ci aiuti a capire la Sua realtà." />

                  <QuestionLabel text="Fatturato annuo *" />
                  <div className="space-y-2 mb-6">
                    {[
                      "Sotto €500k",
                      "€500k - €2M",
                      "€2M - €5M",
                      "€5M - €12M",
                      "Sopra €12M",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.revenue === opt} onClick={() => update("revenue", opt)} />
                    ))}
                  </div>

                  <QuestionLabel text="Numero di collaboratori *" />
                  <div className="space-y-2 mb-6">
                    {["Meno di 10", "10 - 25", "25 - 50", "Oltre 50"].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.employees === opt} onClick={() => update("employees", opt)} />
                    ))}
                  </div>

                  <QuestionLabel text="Settore principale *" />
                  <div className="space-y-2">
                    {[
                      "Manifattura e produzione",
                      "Commercio all'ingrosso o al dettaglio",
                      "Servizi professionali",
                      "Costruzioni e impiantistica",
                      "Logistica e trasporti",
                      "Ristorazione e hospitality",
                      "Altro",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.sector === opt} onClick={() => update("sector", opt)} />
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Step 2: Pain Diagnosis (Italian PMI Specific) ─── */}
              {step === 2 && (
                <div>
                  <StepLabel text="Dove fa più male?" />
                  <StepTitle text="Ogni azienda ha un punto debole. Qual è il Suo?" />

                  <QuestionLabel text="Qual è il maggiore ostacolo alla crescita oggi? *" />
                  <div className="space-y-2 mb-6">
                    {[
                      "Processi manuali che rallentano tutto",
                      "Dati sparsi tra Excel, WhatsApp e carta",
                      "Team sovraccaricato con attività ripetitive",
                      "Nessuna visibilità in tempo reale su ricavi e costi",
                      "Difficoltà a trovare e trattenere talenti",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.mainObstacle === opt} onClick={() => update("mainObstacle", opt)} />
                    ))}
                  </div>

                  <QuestionLabel text="Dove si trovano i dati della Sua azienda oggi? *" />
                  <div className="space-y-2 mb-6">
                    {[
                      "Fogli Excel sparsi e chat WhatsApp",
                      "ERP o gestionale datato, senza integrazione",
                      "Carta, quaderni o memoria del team",
                      "Software moderno ma non collegato tra loro",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.dataLocation === opt} onClick={() => update("dataLocation", opt)} />
                    ))}
                  </div>

                  <QuestionLabel text="La gestione della liquidità è una preoccupazione?" />
                  <div className="space-y-2 mb-6">
                    {[
                      "Sì, spesso non ho visibilità sul flusso di cassa",
                      "A volte, soprattutto con ritardi nei pagamenti",
                      "No, la liquidità è sotto controllo",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.cashFlowChallenge === opt} onClick={() => update("cashFlowChallenge", opt)} />
                    ))}
                  </div>

                  <QuestionLabel text="Riesci a delegare le decisioni operative?" />
                  <div className="space-y-2">
                    {[
                      "No, tutto passa da me — sono il collo di bottiglia",
                      "Delego poco, ma vorrei un sistema che mi dia controllo",
                      "Sì, ho un team autonomo con processi chiari",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.delegationChallenge === opt} onClick={() => update("delegationChallenge", opt)} />
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Step 3: Tech Maturity & Governance ─── */}
              {step === 3 && (
                <div>
                  <StepLabel text="Tecnologia e strumenti" />
                  <StepTitle text="Cosa usi oggi per mandare avanti l'azienda?" />

                  <TextAreaField
                    label="Strumenti attuali (CRM, ERP, gestionali, ecc.)"
                    value={form.currentTools}
                    onChange={(v) => update("currentTools", v)}
                    placeholder="es. SAP per la contabilità, Google Workspace per le email, nessun CRM..."
                  />

                  <QuestionLabel text="La Sua azienda utilizza già soluzioni di IA o automazione? *" />
                  <div className="space-y-2 mb-4">
                    {[
                      "No, non ancora",
                      "Sì, ma in modo informale (ChatGPT, Copilot...)",
                      "Sì, con strumenti strutturati e approvati",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.usesAI === opt} onClick={() => update("usesAI", opt)} />
                    ))}
                  </div>

                  {(form.usesAI === "Sì, ma in modo informale (ChatGPT, Copilot...)" || form.usesAI === "Sì, con strumenti strutturati e approvati") && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <InputField
                        label="Quali soluzioni di IA utilizzate?"
                        value={form.aiDetails}
                        onChange={(v) => update("aiDetails", v)}
                        placeholder="es. ChatGPT per email, Copilot per codice, automazioni Zapier..."
                      />
                    </motion.div>
                  )}

                  <QuestionLabel text="I Suoi dipendenti usano strumenti di IA senza approvazione aziendale? (Shadow AI)" />
                  <div className="space-y-2">
                    {[
                      "Sì, probabilmente — non abbiamo regole chiare",
                      "Non lo so, non ho visibilità su questo",
                      "No, abbiamo policy chiare sull'uso dell'IA",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.shadowAIConcern === opt} onClick={() => update("shadowAIConcern", opt)} />
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Step 4: Urgency, Succession & Authority ─── */}
              {step === 4 && (
                <div>
                  <StepLabel text="Il prossimo passo" />
                  <StepTitle text="Cosa vuoi ottenere nei prossimi 90 giorni?" />

                  <QuestionLabel text="Qual è la Sua priorità nei prossimi 90 giorni? *" />
                  <div className="space-y-2 mb-6">
                    {[
                      "Ridurre costi e aumentare i margini",
                      "Automatizzare processi e liberare tempo",
                      "Sto esplorando le opzioni",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.priority === opt} onClick={() => update("priority", opt)} />
                    ))}
                  </div>

                  <QuestionLabel text="Il know-how aziendale è documentato o dipende da poche persone?" />
                  <div className="space-y-2 mb-6">
                    {[
                      "Dipende da me o da poche persone chiave",
                      "È già documentato o in fase di strutturazione",
                    ].map((opt) => (
                      <RadioOption key={opt} label={opt} selected={form.successionConcern === opt} onClick={() => update("successionConcern", opt)} />
                    ))}
                  </div>

                  <QuestionLabel text="Sei tu a decidere sugli investimenti? *" />
                  <div className="space-y-2">
                    {[
                      "Sì, decido io",
                      "Decido con altri (soci, familiari)",
                    ].map((opt) => (
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
                backgroundColor: canProceed() ? "#C4704B" : "oklch(0.90 0.003 60)",
                fontWeight: 600,
                opacity: submitLead.isPending ? 0.6 : 1,
              }}
            >
              {submitLead.isPending
                ? "Invio in corso..."
                : step === TOTAL_STEPS - 1
                ? "Richiedi Conversazione"
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
          I Suoi dati sono protetti e trattati in conformità al GDPR (Reg. UE 2016/679).
          <br />
          Non condivideremo mai le Sue informazioni con terze parti.
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
