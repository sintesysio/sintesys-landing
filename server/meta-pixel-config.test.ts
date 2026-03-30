import { describe, it, expect } from "vitest";

describe("Meta Pixel Configuration", () => {
  it("should have VITE_META_PIXEL_ID set in environment", () => {
    const pixelId = process.env.VITE_META_PIXEL_ID;
    expect(pixelId).toBeDefined();
    expect(pixelId).not.toBe("");
    expect(pixelId).not.toContain("VITE_");
    expect(pixelId).not.toContain("%");
  });

  it("should have a valid Meta Pixel ID format (numeric, 15-16 digits)", () => {
    const pixelId = process.env.VITE_META_PIXEL_ID!;
    expect(pixelId).toMatch(/^\d{15,16}$/);
  });

  it("should match the Sintesys.io Meta Pixel ID", () => {
    const pixelId = process.env.VITE_META_PIXEL_ID!;
    expect(pixelId).toBe("1492021632520081");
  });

  it("should be able to reach the Meta Pixel endpoint", async () => {
    const pixelId = process.env.VITE_META_PIXEL_ID!;
    const url = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    const response = await fetch(url, { method: "GET" });
    // Meta returns a 1x1 pixel image (200 OK)
    expect(response.status).toBe(200);
  });
});
