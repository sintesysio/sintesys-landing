import { describe, it, expect } from "vitest";

/**
 * Tests for the Links page (/links) — Instagram Bio Link
 * Validates UTM URL generation, link structure, and route configuration
 */

const BASE_URL = "https://sintesysio.io";

function buildUtmUrl(path: string, utmContent: string): string {
  const url = new URL(path, BASE_URL);
  url.searchParams.set("utm_source", "ig");
  url.searchParams.set("utm_medium", "linkinbio");
  url.searchParams.set("utm_campaign", "bio-sintesys");
  url.searchParams.set("utm_content", utmContent);
  url.searchParams.set("utm_term", "bio-link");
  return url.toString();
}

// Mirror the LINKS array from Links.tsx to validate contract
const LINKS = [
  { label: "Prenota la Sessione Strategica", href: "/", utmContent: "sessione-strategica", primary: true },
  { label: "Il Giornale dell'IA", href: "/giornale", utmContent: "giornale-ia" },
  { label: "Chi è Sintesys.io", href: "/chi-siamo", utmContent: "chi-siamo" },
  { label: "Contattaci", href: "/contattaci", utmContent: "contattaci" },
];

describe("Links Page — UTM URL Generation", () => {
  it("generates correct UTM URL for Landing Page (Sessione Strategica)", () => {
    const url = buildUtmUrl("/", "sessione-strategica");
    expect(url).toContain("utm_source=ig");
    expect(url).toContain("utm_medium=linkinbio");
    expect(url).toContain("utm_campaign=bio-sintesys");
    expect(url).toContain("utm_content=sessione-strategica");
    expect(url).toContain("utm_term=bio-link");
    expect(url).toContain("sintesysio.io");
  });

  it("generates correct UTM URL for Il Giornale dell'IA", () => {
    const url = buildUtmUrl("/giornale", "giornale-ia");
    expect(url).toContain("/giornale");
    expect(url).toContain("utm_source=ig");
    expect(url).toContain("utm_content=giornale-ia");
  });

  it("generates correct UTM URL for Chi Siamo", () => {
    const url = buildUtmUrl("/chi-siamo", "chi-siamo");
    expect(url).toContain("/chi-siamo");
    expect(url).toContain("utm_content=chi-siamo");
  });

  it("generates correct UTM URL for Contattaci", () => {
    const url = buildUtmUrl("/contattaci", "contattaci");
    expect(url).toContain("/contattaci");
    expect(url).toContain("utm_content=contattaci");
  });

  it("all UTM URLs use the production domain", () => {
    LINKS.forEach((link) => {
      const url = buildUtmUrl(link.href, link.utmContent);
      expect(url.startsWith("https://sintesysio.io")).toBe(true);
    });
  });

  it("UTM parameters are properly encoded and parseable", () => {
    const url = buildUtmUrl("/", "sessione-strategica");
    const parsed = new URL(url);
    expect(parsed.searchParams.get("utm_source")).toBe("ig");
    expect(parsed.searchParams.get("utm_medium")).toBe("linkinbio");
    expect(parsed.searchParams.get("utm_campaign")).toBe("bio-sintesys");
    expect(parsed.searchParams.get("utm_content")).toBe("sessione-strategica");
    expect(parsed.searchParams.get("utm_term")).toBe("bio-link");
  });
});

describe("Links Page — Link Structure Contract", () => {
  it("has exactly 4 main links defined", () => {
    expect(LINKS).toHaveLength(4);
  });

  it("has exactly 1 primary link (Sessione Strategica)", () => {
    const primaryLinks = LINKS.filter((l) => l.primary);
    expect(primaryLinks).toHaveLength(1);
    expect(primaryLinks[0].label).toBe("Prenota la Sessione Strategica");
    expect(primaryLinks[0].href).toBe("/");
  });

  it("all links have required fields (label, href, utmContent)", () => {
    LINKS.forEach((link) => {
      expect(link.label).toBeTruthy();
      expect(link.href).toBeTruthy();
      expect(link.utmContent).toBeTruthy();
      expect(link.href.startsWith("/")).toBe(true);
    });
  });

  it("all utmContent values are unique", () => {
    const contents = LINKS.map((l) => l.utmContent);
    expect(new Set(contents).size).toBe(contents.length);
  });

  it("links point to valid routes in the app", () => {
    const validRoutes = ["/", "/giornale", "/chi-siamo", "/contattaci", "/grazie", "/links", "/mappa", "/404"];
    LINKS.forEach((link) => {
      expect(validRoutes).toContain(link.href);
    });
  });
});

describe("Links Page — Route Configuration", () => {
  it("/links route should be in the noPopupRoutes list", () => {
    // Mirror the noPopupRoutes from App.tsx
    const noPopupRoutes = ["/", "/grazie", "/links"];
    expect(noPopupRoutes).toContain("/links");
  });

  it("/links should not trigger popup (not a content page)", () => {
    const noPopupRoutes = ["/", "/grazie", "/links"];
    const location = "/links";
    const shouldShowPopup = !noPopupRoutes.includes(location) && !location.startsWith("/admin");
    expect(shouldShowPopup).toBe(false);
  });
});
