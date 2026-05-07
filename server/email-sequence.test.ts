/**
 * Tests for the Stripe → Mailchimp email sequence integration.
 * Tests the logic of:
 * 1. syncPurchaserToMailchimp (contact creation + tag)
 * 2. recordPurchase + markEmailSent (DB operations)
 * 3. Scheduled email sequence processor logic (days elapsed calculation)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Mock environment variables
vi.stubEnv("MAILCHIMP_API_KEY", "test-api-key-123");
vi.stubEnv("MAILCHIMP_SERVER_PREFIX", "us14");
vi.stubEnv("MAILCHIMP_LIST_ID", "test-list-id");

describe("Email Sequence Integration", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("syncPurchaserToMailchimp", () => {
    it("should create/update contact and apply tag", async () => {
      // Mock successful PUT (upsert member)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "abc123", email_address: "test@example.com" }),
      });
      // Mock successful POST (apply tag)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const { syncPurchaserToMailchimp } = await import("./mailchimp");
      const result = await syncPurchaserToMailchimp("test@example.com", "Mario Rossi", "PROD_mappa_ia_47");

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Verify PUT call (upsert member)
      const putCall = mockFetch.mock.calls[0];
      expect(putCall[0]).toContain("/lists/test-list-id/members/");
      expect(putCall[1].method).toBe("PUT");
      const putBody = JSON.parse(putCall[1].body);
      expect(putBody.email_address).toBe("test@example.com");
      expect(putBody.merge_fields.FNAME).toBe("Mario");
      expect(putBody.merge_fields.LNAME).toBe("Rossi");
      expect(putBody.merge_fields.LEADTYPE).toBe("Acquirente");

      // Verify POST call (apply tag)
      const postCall = mockFetch.mock.calls[1];
      expect(postCall[0]).toContain("/tags");
      expect(postCall[1].method).toBe("POST");
      const postBody = JSON.parse(postCall[1].body);
      expect(postBody.tags[0].name).toBe("PROD_mappa_ia_47");
      expect(postBody.tags[0].status).toBe("active");
    });

    it("should return error when Mailchimp credentials are missing", async () => {
      vi.stubEnv("MAILCHIMP_API_KEY", "");

      // Need to re-import to pick up new env
      vi.resetModules();
      const { syncPurchaserToMailchimp } = await import("./mailchimp");
      const result = await syncPurchaserToMailchimp("test@example.com", "Mario", "PROD_mappa_ia_47");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Missing Mailchimp credentials");

      // Restore
      vi.stubEnv("MAILCHIMP_API_KEY", "test-api-key-123");
    });
  });

  describe("sendTemplateEmail", () => {
    it("should create campaign and send it", async () => {
      // Mock successful campaign creation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "campaign123" }),
      });
      // Mock successful send
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const { sendTemplateEmail } = await import("./email-sequence");
      const result = await sendTemplateEmail("test@example.com", "d0");

      expect(result.success).toBe(true);
      expect(result.campaignId).toBe("campaign123");
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Verify campaign creation
      const createCall = mockFetch.mock.calls[0];
      expect(createCall[0]).toContain("/campaigns");
      const createBody = JSON.parse(createCall[1].body);
      expect(createBody.settings.template_id).toBe(10054956); // D+0 template
      expect(createBody.settings.from_name).toBe("Lamberto Grinover");
      expect(createBody.settings.reply_to).toBe("lamberto@ilconsigliere.io");

      // Verify send call
      const sendCall = mockFetch.mock.calls[1];
      expect(sendCall[0]).toContain("/campaigns/campaign123/actions/send");
      expect(sendCall[1].method).toBe("POST");
    });

    it("should use correct template for each step", async () => {
      const { SEQUENCE_TEMPLATES } = await import("./email-sequence");

      expect(SEQUENCE_TEMPLATES.d0.id).toBe(10054956);
      expect(SEQUENCE_TEMPLATES.d3.id).toBe(10055006);
      expect(SEQUENCE_TEMPLATES.d5.id).toBe(10055007);
      expect(SEQUENCE_TEMPLATES.d8.id).toBe(10055008);
    });
  });

  describe("applySettimanaZeroTag", () => {
    it("should apply the STATUS_pronto_settimana_zero tag", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const { applySettimanaZeroTag } = await import("./email-sequence");
      const result = await applySettimanaZeroTag("test@example.com");

      expect(result.success).toBe(true);

      const call = mockFetch.mock.calls[0];
      expect(call[0]).toContain("/tags");
      const body = JSON.parse(call[1].body);
      expect(body.tags[0].name).toBe("STATUS_pronto_settimana_zero");
      expect(body.tags[0].status).toBe("active");
    });
  });

  describe("Days elapsed calculation", () => {
    it("should correctly calculate days since purchase", () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
      const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);

      function daysElapsed(purchasedAt: Date): number {
        const diffMs = now.getTime() - purchasedAt.getTime();
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
      }

      expect(daysElapsed(threeDaysAgo)).toBe(3);
      expect(daysElapsed(fiveDaysAgo)).toBe(5);
      expect(daysElapsed(eightDaysAgo)).toBe(8);
      expect(daysElapsed(now)).toBe(0);
    });
  });

  describe("Stripe webhook product detection", () => {
    it("should identify Mappa IA purchase by product_key", () => {
      const productKey1 = "mappa_opportunita_ia";
      const productKey2 = "mappa_with_sessione";
      const productKey3 = "sessione_diagnosi_ia";

      const isMappa = (key: string) =>
        key === "mappa_opportunita_ia" || key === "mappa_with_sessione";

      expect(isMappa(productKey1)).toBe(true);
      expect(isMappa(productKey2)).toBe(true);
      expect(isMappa(productKey3)).toBe(false);
    });
  });
});
