/**
 * Notion CRM Integration
 * 
 * Syncs leads from both forms (popup + Contattaci) to the Notion CRM database.
 * - Popup leads → Status: "Lead"
 * - Contattaci leads → Status: "Qualificado"
 * 
 * Uses the Notion API via the built-in Forge API proxy.
 */

const NOTION_API_VERSION = "2022-06-28";
const NOTION_BASE_URL = "https://api.notion.com/v1";

// CRM de vendas database — data source ID
const DATA_SOURCE_ID = "f9c3c788-4339-83fd-8bab-01b3b4e807fe";

// We use the Notion internal integration token from env
function getNotionHeaders() {
  const token = process.env.NOTION_API_KEY;
  if (!token) {
    throw new Error("[Notion] NOTION_API_KEY not configured");
  }
  return {
    "Authorization": `Bearer ${token}`,
    "Notion-Version": NOTION_API_VERSION,
    "Content-Type": "application/json",
  };
}

/**
 * Create a page in the Notion CRM database.
 * Uses the Notion API directly (POST /v1/pages).
 */
async function createNotionPage(properties: Record<string, any>, content?: string) {
  const body: any = {
    parent: {
      database_id: DATA_SOURCE_ID,
    },
    properties,
  };

  if (content) {
    // Add content as a paragraph block
    body.children = [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content } }],
        },
      },
    ];
  }

  const response = await fetch(`${NOTION_BASE_URL}/pages`, {
    method: "POST",
    headers: getNotionHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`[Notion] Failed to create page: ${response.status} ${errorBody}`);
  }

  return await response.json();
}

/**
 * Search for an existing lead by email in the Notion CRM.
 */
async function findLeadByEmail(email: string): Promise<any | null> {
  const body = {
    filter: {
      property: "E-mail",
      email: {
        equals: email,
      },
    },
    page_size: 1,
  };

  const response = await fetch(`${NOTION_BASE_URL}/databases/${DATA_SOURCE_ID}/query`, {
    method: "POST",
    headers: getNotionHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`[Notion] Failed to query database: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return data.results.length > 0 ? data.results[0] : null;
}

/**
 * Update an existing Notion page's properties.
 */
async function updateNotionPage(pageId: string, properties: Record<string, any>) {
  const response = await fetch(`${NOTION_BASE_URL}/pages/${pageId}`, {
    method: "PATCH",
    headers: getNotionHeaders(),
    body: JSON.stringify({ properties }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`[Notion] Failed to update page: ${response.status} ${errorBody}`);
  }

  return await response.json();
}

// ─── Public API ──────────────────────────────────────────────

interface SimpleLeadData {
  name: string;
  email: string;
  phone?: string;
  sector: string;
}

interface QualifiedLeadData {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  revenue: string;
  employees: string;
  sector: string;
  mainObstacle: string;
  dataLocation: string;
  cashFlowChallenge?: string;
  delegationChallenge?: string;
  currentTools?: string;
  usesAI: string;
  aiDetails?: string;
  shadowAIConcern?: string;
  priority: string;
  successionConcern?: string;
  isDecisionMaker: string;
}

/**
 * Sync a simple lead (popup) to Notion CRM with Status = "Lead"
 */
export async function syncSimpleLeadToNotion(data: SimpleLeadData): Promise<void> {
  // Check if lead already exists
  const existing = await findLeadByEmail(data.email);

  if (existing) {
    console.log(`[Notion] Lead ${data.email} already exists, skipping`);
    return;
  }

  const properties: Record<string, any> = {
    "Nome": {
      title: [{ text: { content: data.name } }],
    },
    "E-mail": {
      email: data.email,
    },
    "Status": {
      status: { name: "Lead" },
    },
    "Prioridade": {
      select: { name: "Baixa" },
    },
  };

  if (data.phone) {
    properties["Telefone"] = { phone_number: data.phone };
  }

  // Build content with lead details
  const contentLines = [
    `Settore: ${data.sector}`,
    `Fonte: Popup (Lead Magnet)`,
    `Data: ${new Date().toISOString().slice(0, 19).replace("T", " ")}`,
  ];

  await createNotionPage(properties, contentLines.join("\n"));
  console.log(`[Notion] Simple lead synced: ${data.email}`);
}

/**
 * Sync a qualified lead (Contattaci) to Notion CRM with Status = "Qualificado"
 */
// ─── Read-only API functions (for Admin Dashboard) ──────────────────

export interface NotionDeal {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string;
  priority: string | null;
  createdTime: string;
  lastEditedTime: string;
  contentSnippet: string | null;
}

/**
 * Map Notion status names to pipeline stage IDs.
 */
function mapStatusToStage(status: string): string {
  const map: Record<string, string> = {
    "Lead": "lead",
    "Qualificado": "qualificato",
    "In Negoziazione": "negoziazione",
    "Negoziazione": "negoziazione",
    "Chiuso": "chiuso",
    "Chiuso Vinto": "chiuso",
    "Chiuso Perso": "chiuso",
  };
  return map[status] || "lead";
}

/**
 * Read all deals from the Notion CRM pipeline database.
 * Returns deals grouped by status for Kanban display.
 */
export async function getNotionPipelineDeals(): Promise<NotionDeal[]> {
  const body = {
    page_size: 100,
    sorts: [
      { timestamp: "last_edited_time", direction: "descending" },
    ],
  };

  const response = await fetch(`${NOTION_BASE_URL}/databases/${DATA_SOURCE_ID}/query`, {
    method: "POST",
    headers: getNotionHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`[Notion] Failed to query pipeline: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const results = data.results || [];

  return results.map((page: any) => {
    const props = page.properties || {};

    // Extract title (Nome)
    const nameTitle = props["Nome"]?.title || [];
    const name = nameTitle.map((t: any) => t.plain_text).join("") || "Sem nome";

    // Extract email
    const email = props["E-mail"]?.email || "";

    // Extract phone
    const phone = props["Telefone"]?.phone_number || null;

    // Extract company (rich_text)
    const companyRt = props["Empresa"]?.rich_text || [];
    const company = companyRt.map((t: any) => t.plain_text).join("") || null;

    // Extract status
    const status = props["Status"]?.status?.name || "Lead";

    // Extract priority
    const priority = props["Prioridade"]?.select?.name || null;

    return {
      id: page.id,
      name,
      email,
      phone,
      company,
      status,
      priority,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      contentSnippet: null, // populated on detail request
    };
  });
}

/**
 * Get detailed content blocks of a Notion page (for deal detail drawer).
 */
export async function getNotionDealDetail(pageId: string): Promise<{ deal: NotionDeal; content: string }> {
  // Get page properties
  const pageResponse = await fetch(`${NOTION_BASE_URL}/pages/${pageId}`, {
    headers: getNotionHeaders(),
  });

  if (!pageResponse.ok) {
    throw new Error(`[Notion] Failed to get page: ${pageResponse.status}`);
  }

  const page = await pageResponse.json();
  const props = page.properties || {};

  const nameTitle = props["Nome"]?.title || [];
  const name = nameTitle.map((t: any) => t.plain_text).join("") || "Sem nome";
  const email = props["E-mail"]?.email || "";
  const phone = props["Telefone"]?.phone_number || null;
  const companyRt = props["Empresa"]?.rich_text || [];
  const company = companyRt.map((t: any) => t.plain_text).join("") || null;
  const status = props["Status"]?.status?.name || "Lead";
  const priority = props["Prioridade"]?.select?.name || null;

  // Get page content blocks
  const blocksResponse = await fetch(`${NOTION_BASE_URL}/blocks/${pageId}/children?page_size=100`, {
    headers: getNotionHeaders(),
  });

  let content = "";
  if (blocksResponse.ok) {
    const blocksData = await blocksResponse.json();
    const blocks = blocksData.results || [];
    content = blocks
      .filter((b: any) => b.type === "paragraph")
      .map((b: any) => {
        const richText = b.paragraph?.rich_text || [];
        return richText.map((t: any) => t.plain_text).join("");
      })
      .filter(Boolean)
      .join("\n");
  }

  return {
    deal: {
      id: pageId,
      name,
      email,
      phone,
      company,
      status,
      priority,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      contentSnippet: content.slice(0, 200),
    },
    content,
  };
}

export async function syncQualifiedLeadToNotion(data: QualifiedLeadData): Promise<void> {
  // Check if lead already exists
  const existing = await findLeadByEmail(data.email);

  if (existing) {
    // Upgrade existing lead to "Qualificado"
    await updateNotionPage(existing.id, {
      "Status": { status: { name: "Qualificado" } },
      "Prioridade": { select: { name: "Alta" } },
      "Empresa": { rich_text: [{ text: { content: data.companyName || "" } }] },
    });
    console.log(`[Notion] Lead ${data.email} upgraded to Qualificado`);
    return;
  }

  const properties: Record<string, any> = {
    "Nome": {
      title: [{ text: { content: data.name } }],
    },
    "E-mail": {
      email: data.email,
    },
    "Status": {
      status: { name: "Qualificado" },
    },
    "Prioridade": {
      select: { name: "Alta" },
    },
  };

  if (data.phone) {
    properties["Telefone"] = { phone_number: data.phone };
  }

  if (data.companyName) {
    properties["Empresa"] = {
      rich_text: [{ text: { content: data.companyName } }],
    };
  }

  // Build rich content with all qualification data
  const contentLines = [
    `── PROFILO AZIENDALE ──`,
    `Settore: ${data.sector}`,
    `Fatturato: ${data.revenue}`,
    `Dipendenti: ${data.employees}`,
    ``,
    `── CRITICITÀ ──`,
    `Ostacolo principale: ${data.mainObstacle}`,
    `Dove sono i dati: ${data.dataLocation}`,
    data.cashFlowChallenge ? `Liquidità: ${data.cashFlowChallenge}` : null,
    data.delegationChallenge ? `Delega: ${data.delegationChallenge}` : null,
    ``,
    `── TECNOLOGIA ──`,
    data.currentTools ? `Strumenti attuali: ${data.currentTools}` : null,
    `Usa IA: ${data.usesAI}`,
    data.aiDetails ? `Dettagli IA: ${data.aiDetails}` : null,
    data.shadowAIConcern ? `Shadow AI: ${data.shadowAIConcern}` : null,
    ``,
    `── URGENZA ──`,
    `Priorità: ${data.priority}`,
    data.successionConcern ? `Successione: ${data.successionConcern}` : null,
    `Decision maker: ${data.isDecisionMaker}`,
    ``,
    `Fonte: Formulário Contattaci (Qualificado)`,
    `Data: ${new Date().toISOString().slice(0, 19).replace("T", " ")}`,
  ].filter(Boolean).join("\n");

  await createNotionPage(properties, contentLines);
  console.log(`[Notion] Qualified lead synced: ${data.email}`);
}
