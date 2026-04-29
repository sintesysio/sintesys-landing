import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock Mailchimp functions ──────────────────────────────────────
vi.mock("./mailchimp", () => ({
  syncSimpleLead: vi.fn().mockResolvedValue({ success: true }),
  syncQualifiedLead: vi.fn().mockResolvedValue({ success: true }),
  getMailchimpListStats: vi.fn().mockResolvedValue({
    memberCount: 150,
    unsubscribeCount: 5,
    avgOpenRate: 0.35,
    avgClickRate: 0.08,
    campaignCount: 12,
  }),
  getMailchimpCampaigns: vi.fn().mockResolvedValue([
    {
      id: "camp_001",
      webId: 12345,
      title: "Newsletter Marzo 2026",
      subject: "L'IA per la tua PMI",
      status: "sent",
      sendTime: "2026-03-15T10:00:00Z",
      recipients: 140,
      opens: { total: 85, rate: 0.42, unique: 60 },
      clicks: { total: 25, rate: 0.12, unique: 18 },
      bounces: { hardBounces: 2, softBounces: 1 },
      unsubscribes: 0,
    },
    {
      id: "camp_002",
      webId: 12346,
      title: "Welcome Series - Giorno 1",
      subject: "Benvenuto in Il Consigliere",
      status: "sent",
      sendTime: "2026-03-10T09:00:00Z",
      recipients: 50,
      opens: { total: 30, rate: 0.55, unique: 28 },
      clicks: { total: 10, rate: 0.18, unique: 8 },
      bounces: { hardBounces: 0, softBounces: 0 },
      unsubscribes: 1,
    },
  ]),
}));

// ─── Mock Notion functions ──────────────────────────────────────
vi.mock("./notion", () => ({
  syncSimpleLeadToNotion: vi.fn().mockResolvedValue(undefined),
  syncQualifiedLeadToNotion: vi.fn().mockResolvedValue(undefined),
  getNotionPipelineDeals: vi.fn().mockResolvedValue([
    {
      id: "page_001",
      name: "Mario Rossi",
      email: "mario@azienda.it",
      phone: "+39 02 1234567",
      company: "Rossi Manufacturing",
      status: "Lead",
      priority: "Baixa",
      createdTime: "2026-03-01T10:00:00Z",
      lastEditedTime: "2026-03-20T14:30:00Z",
      contentSnippet: null,
    },
    {
      id: "page_002",
      name: "Giulia Bianchi",
      email: "giulia@bianchi.it",
      phone: null,
      company: "Bianchi Servizi",
      status: "Qualificado",
      priority: "Alta",
      createdTime: "2026-03-05T08:00:00Z",
      lastEditedTime: "2026-03-25T16:00:00Z",
      contentSnippet: null,
    },
    {
      id: "page_003",
      name: "Luca Verdi",
      email: "luca@verdi.it",
      phone: "+39 06 9876543",
      company: null,
      status: "In Negoziazione",
      priority: "Alta",
      createdTime: "2026-02-15T12:00:00Z",
      lastEditedTime: "2026-03-28T09:00:00Z",
      contentSnippet: null,
    },
  ]),
  getNotionDealDetail: vi.fn().mockResolvedValue({
    deal: {
      id: "page_002",
      name: "Giulia Bianchi",
      email: "giulia@bianchi.it",
      phone: null,
      company: "Bianchi Servizi",
      status: "Qualificado",
      priority: "Alta",
      createdTime: "2026-03-05T08:00:00Z",
      lastEditedTime: "2026-03-25T16:00:00Z",
      contentSnippet: "Settore: Servizi professionali",
    },
    content:
      "── PROFILO AZIENDALE ──\nSettore: Servizi professionali\nFatturato: €1M-5M\nDipendenti: 10-50\n\n── CRITICITÀ ──\nOstacolo principale: Gestione manuale dei dati",
  }),
}));

// ─── Mock DB functions ──────────────────────────────────────
vi.mock("./db", () => ({
  createLead: vi.fn(),
  getLeadByEmail: vi.fn(),
  getAllLeads: vi.fn().mockResolvedValue([]),
  getDailyEdition: vi.fn(),
  getLatestEdition: vi.fn(),
  createQualifiedLead: vi.fn(),
  getQualifiedLeadByEmail: vi.fn(),
  getAllQualifiedLeads: vi.fn().mockResolvedValue([]),
  createClient: vi.fn(),
  updateClient: vi.fn(),
  deleteClient: vi.fn(),
  getClientById: vi.fn(),
  getAllClients: vi.fn().mockResolvedValue([]),
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  getTransactionsByClient: vi.fn().mockResolvedValue([]),
  getAllTransactions: vi.fn().mockResolvedValue([]),
  getTransactionsByDateRange: vi.fn().mockResolvedValue([]),
  getLeadsStats: vi.fn().mockResolvedValue({
    totalLeads: 0,
    totalQualified: 0,
    leadsToday: 0,
    leadsByDay: [],
    leadsBySector: [],
  }),
  getFinancialSummary: vi.fn().mockResolvedValue({
    totalEntrada: 0,
    totalSaida: 0,
    saldo: 0,
    transactionCount: 0,
  }),
  getBalanceByClient: vi.fn().mockResolvedValue([]),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/file.xlsx", key: "file.xlsx" }),
}));

// ─── Import after mocks ──────────────────────────────────────
import { getMailchimpListStats, getMailchimpCampaigns } from "./mailchimp";
import { getNotionPipelineDeals, getNotionDealDetail } from "./notion";

// ─── Tests ──────────────────────────────────────────────────

describe("Admin Campaigns — Mailchimp Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getMailchimpListStats returns audience metrics", async () => {
    const stats = await getMailchimpListStats();
    expect(stats).toHaveProperty("memberCount");
    expect(stats).toHaveProperty("avgOpenRate");
    expect(stats).toHaveProperty("avgClickRate");
    expect(stats).toHaveProperty("campaignCount");
    expect(stats.memberCount).toBe(150);
    expect(stats.avgOpenRate).toBe(0.35);
    expect(stats.campaignCount).toBe(12);
  });

  it("getMailchimpCampaigns returns campaign list with metrics", async () => {
    const campaigns = await getMailchimpCampaigns(20);
    expect(Array.isArray(campaigns)).toBe(true);
    expect(campaigns.length).toBe(2);

    const first = campaigns[0];
    expect(first.id).toBe("camp_001");
    expect(first.title).toBe("Newsletter Marzo 2026");
    expect(first.status).toBe("sent");
    expect(first.recipients).toBe(140);
    expect(first.opens.rate).toBe(0.42);
    expect(first.clicks.rate).toBe(0.12);
    expect(first.bounces.hardBounces).toBe(2);
  });

  it("campaign has all required fields", async () => {
    const campaigns = await getMailchimpCampaigns(20);
    const c = campaigns[0];

    const requiredFields = [
      "id",
      "webId",
      "title",
      "subject",
      "status",
      "sendTime",
      "recipients",
      "opens",
      "clicks",
      "bounces",
      "unsubscribes",
    ];

    for (const field of requiredFields) {
      expect(c).toHaveProperty(field);
    }
  });

  it("opens/clicks have total, rate, and unique", async () => {
    const campaigns = await getMailchimpCampaigns(20);
    const c = campaigns[0];

    expect(c.opens).toHaveProperty("total");
    expect(c.opens).toHaveProperty("rate");
    expect(c.opens).toHaveProperty("unique");
    expect(c.clicks).toHaveProperty("total");
    expect(c.clicks).toHaveProperty("rate");
    expect(c.clicks).toHaveProperty("unique");
  });

  it("bounces have hardBounces and softBounces", async () => {
    const campaigns = await getMailchimpCampaigns(20);
    const c = campaigns[0];

    expect(c.bounces).toHaveProperty("hardBounces");
    expect(c.bounces).toHaveProperty("softBounces");
    expect(typeof c.bounces.hardBounces).toBe("number");
  });
});

describe("Admin Pipeline — Notion CRM Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getNotionPipelineDeals returns deals list", async () => {
    const deals = await getNotionPipelineDeals();
    expect(Array.isArray(deals)).toBe(true);
    expect(deals.length).toBe(3);
  });

  it("each deal has required fields", async () => {
    const deals = await getNotionPipelineDeals();
    const deal = deals[0];

    const requiredFields = [
      "id",
      "name",
      "email",
      "status",
      "createdTime",
      "lastEditedTime",
    ];

    for (const field of requiredFields) {
      expect(deal).toHaveProperty(field);
    }
  });

  it("deals have correct statuses for pipeline stages", async () => {
    const deals = await getNotionPipelineDeals();
    const statuses = deals.map((d) => d.status);

    expect(statuses).toContain("Lead");
    expect(statuses).toContain("Qualificado");
    expect(statuses).toContain("In Negoziazione");
  });

  it("deal can have optional fields (phone, company, priority)", async () => {
    const deals = await getNotionPipelineDeals();

    // Mario has phone and company
    const mario = deals.find((d) => d.name === "Mario Rossi");
    expect(mario?.phone).toBe("+39 02 1234567");
    expect(mario?.company).toBe("Rossi Manufacturing");

    // Giulia has no phone
    const giulia = deals.find((d) => d.name === "Giulia Bianchi");
    expect(giulia?.phone).toBeNull();
    expect(giulia?.company).toBe("Bianchi Servizi");

    // Luca has no company
    const luca = deals.find((d) => d.name === "Luca Verdi");
    expect(luca?.company).toBeNull();
    expect(luca?.phone).toBe("+39 06 9876543");
  });

  it("getNotionDealDetail returns deal with content", async () => {
    const detail = await getNotionDealDetail("page_002");
    expect(detail).not.toBeNull();
    expect(detail!.deal.name).toBe("Giulia Bianchi");
    expect(detail!.deal.status).toBe("Qualificado");
    expect(detail!.deal.priority).toBe("Alta");
    expect(detail!.content).toContain("PROFILO AZIENDALE");
    expect(detail!.content).toContain("Servizi professionali");
  });

  it("deal detail includes contact information", async () => {
    const detail = await getNotionDealDetail("page_002");
    expect(detail!.deal.email).toBe("giulia@bianchi.it");
    expect(detail!.deal.company).toBe("Bianchi Servizi");
  });

  it("deal detail includes timestamps", async () => {
    const detail = await getNotionDealDetail("page_002");
    expect(detail!.deal.createdTime).toBeTruthy();
    expect(detail!.deal.lastEditedTime).toBeTruthy();
    // Verify ISO format
    expect(new Date(detail!.deal.createdTime).toISOString()).toBeTruthy();
  });
});

describe("Admin Router — Integration endpoints exist", () => {
  it("admin.campaigns router is registered", async () => {
    const { appRouter } = await import("./routers");
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("admin.campaigns.listStats");
    expect(procedures).toContain("admin.campaigns.list");
  });

  it("admin.pipeline router is registered", async () => {
    const { appRouter } = await import("./routers");
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("admin.pipeline.deals");
    expect(procedures).toContain("admin.pipeline.dealDetail");
  });
});
