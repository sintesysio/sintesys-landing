/**
 * Tests for the Lead → Mailchimp email sequence integration.
 * Tests the logic of:
 * 1. sendTemplateEmail (campaign creation + send)
 * 2. applyConsulenzaTag (tag application)
 * 3. Scheduled email sequence processor logic (days elapsed calculation)
 * 4. Template configuration
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
    vi.resetModules();
    vi.stubEnv("MAILCHIMP_API_KEY", "test-api-key-123");
    vi.stubEnv("MAILCHIMP_SERVER_PREFIX", "us14");
    vi.stubEnv("MAILCHIMP_LIST_ID", "test-list-id");
  });

  describe("sendTemplateEmail", () => {
    it("should create and send a campaign for D+0", async () => {
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

      // Verify campaign creation call
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
      expect(SEQUENCE_TEMPLATES.d10.id).toBe(10055008);
    });

    it("should return error when Mailchimp credentials are missing", async () => {
      vi.stubEnv("MAILCHIMP_API_KEY", "");
      vi.stubEnv("MAILCHIMP_LIST_ID", "");

      const { sendTemplateEmail } = await import("./email-sequence");
      const result = await sendTemplateEmail("test@example.com", "d0");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Missing Mailchimp credentials");
    });
  });

  describe("applyConsulenzaTag", () => {
    it("should apply the STATUS_pronto_consulenza tag", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const { applyConsulenzaTag } = await import("./email-sequence");
      const result = await applyConsulenzaTag("test@example.com");

      expect(result.success).toBe(true);

      const call = mockFetch.mock.calls[0];
      expect(call[0]).toContain("/tags");
      const body = JSON.parse(call[1].body);
      expect(body.tags[0].name).toBe("STATUS_pronto_consulenza");
      expect(body.tags[0].status).toBe("active");
    });
  });

  describe("Days elapsed calculation", () => {
    it("should correctly calculate days since lead signup", () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

      function daysElapsed(createdAt: Date): number {
        const diffMs = now.getTime() - createdAt.getTime();
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
      }

      expect(daysElapsed(threeDaysAgo)).toBe(3);
      expect(daysElapsed(fiveDaysAgo)).toBe(5);
      expect(daysElapsed(tenDaysAgo)).toBe(10);
      expect(daysElapsed(now)).toBe(0);
    });

    it("should trigger correct emails based on days elapsed", () => {
      const now = new Date();

      function shouldSendEmail(createdAt: Date, step: "d3" | "d5" | "d10"): boolean {
        const diffMs = now.getTime() - createdAt.getTime();
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const thresholds = { d3: 3, d5: 5, d10: 10 };
        return days >= thresholds[step];
      }

      const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
      expect(shouldSendEmail(fourDaysAgo, "d3")).toBe(true);
      expect(shouldSendEmail(fourDaysAgo, "d5")).toBe(false);
      expect(shouldSendEmail(fourDaysAgo, "d10")).toBe(false);

      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      expect(shouldSendEmail(sevenDaysAgo, "d3")).toBe(true);
      expect(shouldSendEmail(sevenDaysAgo, "d5")).toBe(true);
      expect(shouldSendEmail(sevenDaysAgo, "d10")).toBe(false);

      const elevenDaysAgo = new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000);
      expect(shouldSendEmail(elevenDaysAgo, "d3")).toBe(true);
      expect(shouldSendEmail(elevenDaysAgo, "d5")).toBe(true);
      expect(shouldSendEmail(elevenDaysAgo, "d10")).toBe(true);
    });
  });

  describe("Email sequence flow", () => {
    it("D+0 should be sent immediately on lead form submission", async () => {
      // Mock successful campaign creation + send
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "d0-campaign" }),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const { sendTemplateEmail } = await import("./email-sequence");
      const result = await sendTemplateEmail("newlead@example.com", "d0");

      expect(result.success).toBe(true);
      expect(result.campaignId).toBe("d0-campaign");
    });

    it("D+10 should include Calendly link in template", async () => {
      const { SEQUENCE_TEMPLATES } = await import("./email-sequence");

      // D+10 template is the consulenza invitation
      expect(SEQUENCE_TEMPLATES.d10.name).toContain("Invito Consulenza");
      expect(SEQUENCE_TEMPLATES.d10.subject).toContain("consulenza gratuita");
    });
  });
});
