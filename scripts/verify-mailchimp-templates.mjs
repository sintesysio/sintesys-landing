/**
 * verify-mailchimp-templates.mjs
 * Verifica os templates e automações do Mailchimp para evidência auditável.
 * Uso: node scripts/verify-mailchimp-templates.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env from project .env
const envPath = resolve(__dirname, "../.env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
} catch {
  console.error("Could not load .env file");
}

const API_KEY = process.env.MAILCHIMP_API_KEY;
const SERVER = process.env.MAILCHIMP_SERVER_PREFIX;
const BASE = `https://${SERVER}.api.mailchimp.com/3.0`;

async function mc(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

async function main() {
  const report = { timestamp: new Date().toISOString(), templates: [], automations: [] };

  // 1. Verify templates
  console.log("=== Verificando Templates ===");
  const tplRes = await mc("/templates?count=50&type=user");
  for (const tpl of tplRes.templates || []) {
    if (tpl.name.includes("Welcome")) {
      const detail = await mc(`/templates/${tpl.id}`);
      const info = {
        id: tpl.id,
        name: tpl.name,
        date_created: tpl.date_created,
        date_edited: tpl.date_edited,
        active: tpl.active,
        html_preview: (detail.html || "").substring(0, 500) + "...",
        contains_guida_incentivo: (detail.html || "").includes("Transizione 5.0") || (detail.html || "").includes("incentiv"),
        contains_lamberto_grinover: (detail.html || "").includes("Lamberto Grinover"),
        contains_30_minuti: (detail.html || "").includes("30 minuti"),
      };
      report.templates.push(info);
      console.log(`\nTemplate: ${info.name} (ID: ${info.id})`);
      console.log(`  Criado: ${info.date_created}`);
      console.log(`  Editado: ${info.date_edited}`);
      console.log(`  Contém "Transizione 5.0" ou "incentiv": ${info.contains_guida_incentivo}`);
      console.log(`  Contém "Lamberto Grinover": ${info.contains_lamberto_grinover}`);
      console.log(`  Contém "30 minuti": ${info.contains_30_minuti}`);
    }
  }

  // 2. Verify automations / customer journeys
  console.log("\n=== Verificando Automações ===");
  const autoRes = await mc("/automations?count=50");
  for (const auto of autoRes.automations || []) {
    if (auto.settings?.title?.includes("Welcome")) {
      const info = {
        id: auto.id,
        title: auto.settings.title,
        status: auto.status,
        from_name: auto.settings.from_name,
        reply_to: auto.settings.reply_to,
        subject_line: auto.settings.subject_line,
        create_time: auto.create_time,
        emails_sent: auto.emails_sent,
      };
      report.automations.push(info);
      console.log(`\nAutomação: ${info.title} (ID: ${info.id})`);
      console.log(`  Status: ${info.status}`);
      console.log(`  De: ${info.from_name} <${info.reply_to}>`);
      console.log(`  Assunto: ${info.subject_line}`);
      console.log(`  Emails enviados: ${info.emails_sent}`);
    }
  }

  // 3. Check customer journeys via alternative endpoint
  console.log("\n=== Verificando Customer Journeys ===");
  const cjRes = await mc("/customer-journeys/journeys?count=50");
  if (cjRes.journeys) {
    for (const cj of cjRes.journeys) {
      const info = {
        id: cj.id,
        title: cj.title,
        status: cj.status,
        created_at: cj.created_at,
      };
      report.automations.push(info);
      console.log(`\nJourney: ${info.title} (ID: ${info.id})`);
      console.log(`  Status: ${info.status}`);
      console.log(`  Criado: ${info.created_at}`);
    }
  } else {
    console.log("  (Customer Journeys endpoint não disponível ou vazio)");
  }

  // 4. Check list/audience default settings
  console.log("\n=== Verificando Audiência ===");
  const listRes = await mc("/lists?count=10");
  for (const list of listRes.lists || []) {
    console.log(`\nAudiência: ${list.name} (ID: ${list.id})`);
    console.log(`  Remetente: ${list.campaign_defaults.from_name} <${list.campaign_defaults.from_email}>`);
    console.log(`  Membros: ${list.stats.member_count}`);
    report.audience = {
      id: list.id,
      name: list.name,
      from_name: list.campaign_defaults.from_name,
      from_email: list.campaign_defaults.from_email,
      member_count: list.stats.member_count,
    };
  }

  // Save report
  const outPath = resolve(__dirname, "../mailchimp-verification-report.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\n✅ Relatório salvo em: ${outPath}`);
}

main().catch(console.error);
