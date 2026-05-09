import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock environment variables
vi.stubEnv("MAILCHIMP_API_KEY", "test-api-key-12345");
vi.stubEnv("MAILCHIMP_SERVER_PREFIX", "us14");
vi.stubEnv("MAILCHIMP_LIST_ID", "test-list-id");

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("welcome-email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sendWelcomeEmail creates campaign, sets content, and sends", async () => {
    // Mock campaign creation
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "campaign_123" }),
      })
      // Mock content set
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      // Mock send
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    const { sendWelcomeEmail } = await import("./welcome-email");
    const result = await sendWelcomeEmail("mario@azienda.it", "Mario Rossi");

    expect(result.success).toBe(true);
    expect(result.campaignId).toBe("campaign_123");

    // Verify 3 API calls were made
    expect(mockFetch).toHaveBeenCalledTimes(3);

    // Verify campaign creation call
    const createCall = mockFetch.mock.calls[0];
    expect(createCall[0]).toContain("/campaigns");
    const createBody = JSON.parse(createCall[1].body);
    expect(createBody.settings.subject_line).toContain("Mario");
    expect(createBody.settings.subject_line).toContain("envenuto");
    expect(createBody.settings.from_name).toBe("Lamberto Grinover");
    expect(createBody.settings.reply_to).toBe("lamberto@ilconsigliere.io");

    // Verify content set call
    const contentCall = mockFetch.mock.calls[1];
    expect(contentCall[0]).toContain("/campaigns/campaign_123/content");
    const contentBody = JSON.parse(contentCall[1].body);
    expect(contentBody.html).toContain("Benvenuto");
    expect(contentBody.html).toContain("Mario");
    expect(contentBody.html).toContain("Il Consigliere");
    expect(contentBody.html).toContain("Mappa delle Opportunità IA");

    // Verify send call
    const sendCall = mockFetch.mock.calls[2];
    expect(sendCall[0]).toContain("/campaigns/campaign_123/actions/send");
    expect(sendCall[1].method).toBe("POST");
  });

  it("returns error when campaign creation fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: "Invalid" }),
    });

    const { sendWelcomeEmail } = await import("./welcome-email");
    const result = await sendWelcomeEmail("mario@azienda.it", "Mario Rossi");

    expect(result.success).toBe(false);
    expect(result.error).toContain("Create campaign failed");
  });

  it("returns error when content set fails", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "campaign_456" }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: "Server error" }),
      });

    const { sendWelcomeEmail } = await import("./welcome-email");
    const result = await sendWelcomeEmail("mario@azienda.it", "Mario Rossi");

    expect(result.success).toBe(false);
    expect(result.campaignId).toBe("campaign_456");
    expect(result.error).toContain("Set content failed");
  });

  it("returns error when send fails", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "campaign_789" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: "Send error" }),
      });

    const { sendWelcomeEmail } = await import("./welcome-email");
    const result = await sendWelcomeEmail("mario@azienda.it", "Mario Rossi");

    expect(result.success).toBe(false);
    expect(result.campaignId).toBe("campaign_789");
    expect(result.error).toContain("Send failed");
  });

  it("returns error when Mailchimp credentials are missing", async () => {
    vi.stubEnv("MAILCHIMP_API_KEY", "");

    // Re-import to pick up new env
    vi.resetModules();
    const { sendWelcomeEmail } = await import("./welcome-email");
    const result = await sendWelcomeEmail("mario@azienda.it", "Mario Rossi");

    expect(result.success).toBe(false);
    expect(result.error).toContain("Missing Mailchimp credentials");

    // Restore
    vi.stubEnv("MAILCHIMP_API_KEY", "test-api-key-12345");
  });

  it("generates correct subject line with first name", async () => {
    vi.resetModules();
    const localMockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "campaign_abc" }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    vi.stubGlobal("fetch", localMockFetch);

    const { sendWelcomeEmail } = await import("./welcome-email");
    await sendWelcomeEmail("anna@test.it", "Anna Bianchi");

    const createBody = JSON.parse(localMockFetch.mock.calls[0][1].body);
    expect(createBody.settings.subject_line).toBe("Anna, benvenuto su Il Consigliere");
  });

  it("handles name with only first name", async () => {
    vi.resetModules();
    const localMockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "campaign_def" }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    vi.stubGlobal("fetch", localMockFetch);

    const { sendWelcomeEmail } = await import("./welcome-email");
    await sendWelcomeEmail("luca@test.it", "Luca");

    const createBody = JSON.parse(localMockFetch.mock.calls[0][1].body);
    expect(createBody.settings.subject_line).toBe("Luca, benvenuto su Il Consigliere");
  });
});
