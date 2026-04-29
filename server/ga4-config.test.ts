import { describe, it, expect } from "vitest";

describe("GA4 Configuration", () => {
  it("VITE_GA4_ID should be set and match expected format", () => {
    const gaId = process.env.VITE_GA4_ID;
    expect(gaId).toBeDefined();
    expect(gaId).not.toBe("");
    // GA4 Measurement IDs start with G- followed by alphanumeric characters
    expect(gaId).toMatch(/^G-[A-Z0-9]+$/);
  });

  it("VITE_GA4_ID should be the correct Il Consigliere property", () => {
    const gaId = process.env.VITE_GA4_ID;
    expect(gaId).toBe("G-WWCFW68S8V");
  });

  it("GA4 gtag script URL should be valid and reachable", async () => {
    const gaId = process.env.VITE_GA4_ID;
    if (!gaId) return;
    
    const url = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    const response = await fetch(url, { method: "HEAD" });
    expect(response.status).toBe(200);
  });
});
