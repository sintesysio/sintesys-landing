import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Router-level tests using appRouter.createCaller with admin/non-admin contexts.
 * These tests verify that:
 * 1. Admin procedures return data when called with admin context
 * 2. Admin procedures reject non-admin users with FORBIDDEN
 * 3. Campaigns and Pipeline endpoints handle API errors gracefully (fallback values)
 */

// ─── Mock all external dependencies ──────────────────────────────

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
    totalLeads: 42,
    totalQualified: 8,
    todayLeads: 3,
    todayQualified: 1,
    leadsBySector: [],
    leadsByDay: [],
  }),
  getFinancialSummary: vi.fn().mockResolvedValue({
    totalEntradas: 150000,
    totalSaidas: 50000,
    saldo: 100000,
    monthlyFlow: [],
  }),
  getBalanceByClient: vi.fn().mockResolvedValue([]),
}));

const mockGetMailchimpListStats = vi.fn().mockResolvedValue({
  memberCount: 150,
  unsubscribeCount: 5,
  avgOpenRate: 0.35,
  avgClickRate: 0.08,
  campaignCount: 12,
});

const mockGetMailchimpCampaigns = vi.fn().mockResolvedValue([
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
]);

vi.mock("./mailchimp", () => ({
  syncSimpleLead: vi.fn().mockResolvedValue(undefined),
  syncQualifiedLead: vi.fn().mockResolvedValue(undefined),
  getMailchimpListStats: (...args: any[]) => mockGetMailchimpListStats(...args),
  getMailchimpCampaigns: (...args: any[]) => mockGetMailchimpCampaigns(...args),
}));

const mockGetNotionPipelineDeals = vi.fn().mockResolvedValue([
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
]);

const mockGetNotionDealDetail = vi.fn().mockResolvedValue({
  deal: {
    id: "page_001",
    name: "Mario Rossi",
    email: "mario@azienda.it",
    phone: "+39 02 1234567",
    company: "Rossi Manufacturing",
    status: "Lead",
    priority: "Baixa",
    createdTime: "2026-03-01T10:00:00Z",
    lastEditedTime: "2026-03-20T14:30:00Z",
    contentSnippet: "Settore: Manifattura",
  },
  content: "── PROFILO ──\nSettore: Manifattura\nFatturato: €5M-10M",
});

vi.mock("./notion", () => ({
  syncSimpleLeadToNotion: vi.fn().mockResolvedValue(undefined),
  syncQualifiedLeadToNotion: vi.fn().mockResolvedValue(undefined),
  getNotionPipelineDeals: (...args: any[]) => mockGetNotionPipelineDeals(...args),
  getNotionDealDetail: (...args: any[]) => mockGetNotionDealDetail(...args),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/file.xlsx", key: "file.xlsx" }),
}));

vi.mock("./_core/env", () => ({
  ENV: {
    DATABASE_URL: "mysql://test:test@localhost:3306/test",
    JWT_SECRET: "test-secret",
    VITE_APP_ID: "test-app",
    OAUTH_SERVER_URL: "https://test.oauth.com",
    OWNER_OPEN_ID: "test-owner",
    OWNER_NAME: "Test Owner",
    BUILT_IN_FORGE_API_URL: "https://test.api.com",
    BUILT_IN_FORGE_API_KEY: "test-key",
    MAILCHIMP_API_KEY: "test-mc-key",
    MAILCHIMP_SERVER_PREFIX: "us1",
    MAILCHIMP_LIST_ID: "test-list",
    NOTION_API_KEY: "test-notion-key",
  },
}));

// ─── Import router after mocks ──────────────────────────────────

import { appRouter } from "./routers";

// ─── Helper: create caller with context ──────────────────────────

function createAdminCaller() {
  return appRouter.createCaller({
    req: {} as any,
    res: {} as any,
    user: {
      id: 1,
      openId: "admin-open-id",
      name: "Lamberto Grinover",
      email: "lamberto@ilconsigliere.io",
      avatarUrl: null,
      role: "admin",
      createdAt: new Date(),
    },
  });
}

function createRegularUserCaller() {
  return appRouter.createCaller({
    req: {} as any,
    res: {} as any,
    user: {
      id: 2,
      openId: "user-open-id",
      name: "Regular User",
      email: "user@example.com",
      avatarUrl: null,
      role: "user",
      createdAt: new Date(),
    },
  });
}

function createUnauthCaller() {
  return appRouter.createCaller({
    req: {} as any,
    res: {} as any,
    user: null,
  });
}

// ─── Tests ──────────────────────────────────────────────────────

describe("Admin Router — Access Control (createCaller)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin user can access admin.stats", async () => {
    const caller = createAdminCaller();
    const stats = await caller.admin.stats();
    expect(stats).toHaveProperty("leads");
    expect(stats).toHaveProperty("financial");
    expect(stats.leads.totalLeads).toBe(42);
  });

  it("regular user is FORBIDDEN from admin.stats", async () => {
    const caller = createRegularUserCaller();
    await expect(caller.admin.stats()).rejects.toThrow(/permission/i);
  });

  it("unauthenticated user is FORBIDDEN from admin.stats", async () => {
    const caller = createUnauthCaller();
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("regular user is FORBIDDEN from admin.campaigns.listStats", async () => {
    const caller = createRegularUserCaller();
    await expect(caller.admin.campaigns.listStats()).rejects.toThrow(/permission/i);
  });

  it("regular user is FORBIDDEN from admin.pipeline.deals", async () => {
    const caller = createRegularUserCaller();
    await expect(caller.admin.pipeline.deals()).rejects.toThrow(/permission/i);
  });

  it("regular user is FORBIDDEN from admin.clients.list", async () => {
    const caller = createRegularUserCaller();
    await expect(caller.admin.clients.list()).rejects.toThrow(/permission/i);
  });

  it("regular user is FORBIDDEN from admin.transactions.summary", async () => {
    const caller = createRegularUserCaller();
    await expect(caller.admin.transactions.summary()).rejects.toThrow(/permission/i);
  });
});

describe("Admin Campaigns — Router-level (createCaller)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin can fetch Mailchimp list stats", async () => {
    const caller = createAdminCaller();
    const stats = await caller.admin.campaigns.listStats();

    expect(mockGetMailchimpListStats).toHaveBeenCalledOnce();
    expect(stats).toHaveProperty("memberCount", 150);
    expect(stats).toHaveProperty("avgOpenRate", 0.35);
    expect(stats).toHaveProperty("avgClickRate", 0.08);
    expect(stats).toHaveProperty("campaignCount", 12);
    expect(stats).toHaveProperty("unsubscribeCount", 5);
  });

  it("admin can fetch Mailchimp campaigns list", async () => {
    const caller = createAdminCaller();
    const campaigns = await caller.admin.campaigns.list();

    expect(mockGetMailchimpCampaigns).toHaveBeenCalledWith(20);
    expect(Array.isArray(campaigns)).toBe(true);
    expect(campaigns).toHaveLength(1);

    const c = campaigns[0];
    expect(c.id).toBe("camp_001");
    expect(c.title).toBe("Newsletter Marzo 2026");
    expect(c.status).toBe("sent");
    expect(c.recipients).toBe(140);
    expect(c.opens.rate).toBe(0.42);
    expect(c.clicks.rate).toBe(0.12);
    expect(c.bounces.hardBounces).toBe(2);
  });

  it("campaigns.listStats returns fallback on Mailchimp API error", async () => {
    mockGetMailchimpListStats.mockRejectedValueOnce(new Error("Mailchimp API timeout"));

    const caller = createAdminCaller();
    const stats = await caller.admin.campaigns.listStats();

    // Should return fallback zeros, not throw
    expect(stats.memberCount).toBe(0);
    expect(stats.avgOpenRate).toBe(0);
    expect(stats.avgClickRate).toBe(0);
    expect(stats.campaignCount).toBe(0);
  });

  it("campaigns.list returns empty array on Mailchimp API error", async () => {
    mockGetMailchimpCampaigns.mockRejectedValueOnce(new Error("Mailchimp 500"));

    const caller = createAdminCaller();
    const campaigns = await caller.admin.campaigns.list();

    // Should return empty array, not throw
    expect(Array.isArray(campaigns)).toBe(true);
    expect(campaigns).toHaveLength(0);
  });
});

describe("Admin Pipeline — Router-level (createCaller)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin can fetch Notion pipeline deals", async () => {
    const caller = createAdminCaller();
    const deals = await caller.admin.pipeline.deals();

    expect(mockGetNotionPipelineDeals).toHaveBeenCalledOnce();
    expect(Array.isArray(deals)).toBe(true);
    expect(deals).toHaveLength(1);

    const deal = deals[0];
    expect(deal.id).toBe("page_001");
    expect(deal.name).toBe("Mario Rossi");
    expect(deal.email).toBe("mario@azienda.it");
    expect(deal.company).toBe("Rossi Manufacturing");
    expect(deal.status).toBe("Lead");
  });

  it("admin can fetch deal detail from Notion", async () => {
    const caller = createAdminCaller();
    const detail = await caller.admin.pipeline.dealDetail({ pageId: "page_001" });

    expect(mockGetNotionDealDetail).toHaveBeenCalledWith("page_001");
    expect(detail).not.toBeNull();
    expect(detail!.deal.name).toBe("Mario Rossi");
    expect(detail!.deal.status).toBe("Lead");
    expect(detail!.content).toContain("PROFILO");
    expect(detail!.content).toContain("Manifattura");
  });

  it("pipeline.deals returns empty array on Notion API error", async () => {
    mockGetNotionPipelineDeals.mockRejectedValueOnce(new Error("Notion 401 Unauthorized"));

    const caller = createAdminCaller();
    const deals = await caller.admin.pipeline.deals();

    // Should return empty array, not throw
    expect(Array.isArray(deals)).toBe(true);
    expect(deals).toHaveLength(0);
  });

  it("pipeline.dealDetail returns null on Notion API error", async () => {
    mockGetNotionDealDetail.mockRejectedValueOnce(new Error("Notion page not found"));

    const caller = createAdminCaller();
    const detail = await caller.admin.pipeline.dealDetail({ pageId: "nonexistent" });

    // Should return null, not throw
    expect(detail).toBeNull();
  });

  it("pipeline.dealDetail validates pageId is non-empty", async () => {
    const caller = createAdminCaller();

    await expect(
      caller.admin.pipeline.dealDetail({ pageId: "" })
    ).rejects.toThrow();
  });
});

describe("Admin Stats — Router-level (createCaller)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin can fetch combined stats (leads + financial)", async () => {
    const caller = createAdminCaller();
    const stats = await caller.admin.stats();

    expect(stats.leads.totalLeads).toBe(42);
    expect(stats.leads.totalQualified).toBe(8);
    expect(stats.financial.totalEntradas).toBe(150000);
    expect(stats.financial.saldo).toBe(100000);
  });
});

describe("Admin Clients — Router-level (createCaller)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin can list clients", async () => {
    const caller = createAdminCaller();
    const clients = await caller.admin.clients.list();
    expect(Array.isArray(clients)).toBe(true);
  });
});
