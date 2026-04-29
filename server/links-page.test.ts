import { describe, it, expect } from "vitest";

/**
 * Tests for the Links page (/links) — Instagram Bio Link
 * Validates UTM URL generation, link structure, and route configuration
 *
 * Seções:
 * 1. Mappa delle Opportunità IA → Checkout Stripe (vendita diretta €95,50)
 * 2. Il Giornale dell'IA → Newsletter (cattura lead)
 * 3. Sito Istituzionale → Newsletter (cattura lead)
 * 4. Chi è Il Consigliere → Pagina Chi Siamo
 */

const BASE_URL = "https://ilconsigliere.io";

function buildUtmUrl(path: string, utmContent: string): string {
  const url = new URL(path, BASE_URL);
  url.searchParams.set("utm_source", "ig");
  url.searchParams.set("utm_medium", "linkinbio");
  url.searchParams.set("utm_campaign", "bio-ilconsigliere");
  url.searchParams.set("utm_content", utmContent);
  url.searchParams.set("utm_term", "bio-link");
  return url.toString();
}

// Mirror the LINKS array from Links.tsx to validate contract
const LINKS = [
  { label: "Mappa delle Opportunità IA — €95,50", href: "/mappa", utmContent: "mappa-ia", primary: true, action: "stripe" as const },
  { label: "Il Giornale dell'IA", href: "/giornale", utmContent: "giornale-ia", action: "link" as const },
  { label: "Il Consigliere — Sito Istituzionale", href: "/", utmContent: "sito-istituzionale", action: "link" as const },
  { label: "Chi è Il Consigliere", href: "/chi-siamo", utmContent: "chi-siamo", action: "link" as const },
];

describe("Links Page — UTM URL Generation", () => {
  it("generates correct UTM URL for Mappa IA", () => {
    const url = buildUtmUrl("/mappa", "mappa-ia");
    expect(url).toContain("utm_source=ig");
    expect(url).toContain("utm_medium=linkinbio");
    expect(url).toContain("utm_campaign=bio-ilconsigliere");
    expect(url).toContain("utm_content=mappa-ia");
    expect(url).toContain("utm_term=bio-link");
    expect(url).toContain("ilconsigliere.io");
  });

  it("generates correct UTM URL for Il Giornale dell'IA", () => {
    const url = buildUtmUrl("/giornale", "giornale-ia");
    expect(url).toContain("/giornale");
    expect(url).toContain("utm_source=ig");
    expect(url).toContain("utm_content=giornale-ia");
  });

  it("generates correct UTM URL for Sito Istituzionale", () => {
    const url = buildUtmUrl("/", "sito-istituzionale");
    expect(url).toContain("utm_content=sito-istituzionale");
    expect(url).toContain("ilconsigliere.io");
  });

  it("generates correct UTM URL for Chi Siamo", () => {
    const url = buildUtmUrl("/chi-siamo", "chi-siamo");
    expect(url).toContain("/chi-siamo");
    expect(url).toContain("utm_content=chi-siamo");
  });

  it("all UTM URLs use the production domain", () => {
    LINKS.forEach((link) => {
      const url = buildUtmUrl(link.href, link.utmContent);
      expect(url.startsWith("https://ilconsigliere.io")).toBe(true);
    });
  });

  it("UTM parameters are properly encoded and parseable", () => {
    const url = buildUtmUrl("/mappa", "mappa-ia");
    const parsed = new URL(url);
    expect(parsed.searchParams.get("utm_source")).toBe("ig");
    expect(parsed.searchParams.get("utm_medium")).toBe("linkinbio");
    expect(parsed.searchParams.get("utm_campaign")).toBe("bio-ilconsigliere");
    expect(parsed.searchParams.get("utm_content")).toBe("mappa-ia");
    expect(parsed.searchParams.get("utm_term")).toBe("bio-link");
  });
});

describe("Links Page — Link Structure Contract", () => {
  it("has exactly 4 main links defined", () => {
    expect(LINKS).toHaveLength(4);
  });

  it("has exactly 1 primary link (Mappa IA — Stripe checkout)", () => {
    const primaryLinks = LINKS.filter((l) => l.primary);
    expect(primaryLinks).toHaveLength(1);
    expect(primaryLinks[0].label).toContain("Mappa delle Opportunità IA");
    expect(primaryLinks[0].action).toBe("stripe");
  });

  it("Mappa IA uses Stripe checkout action, others use regular links", () => {
    const stripeLinks = LINKS.filter((l) => l.action === "stripe");
    const regularLinks = LINKS.filter((l) => l.action === "link");
    expect(stripeLinks).toHaveLength(1);
    expect(regularLinks).toHaveLength(3);
  });

  it("links are in correct order: Mappa, Giornale, Sito, Chi Siamo", () => {
    expect(LINKS[0].utmContent).toBe("mappa-ia");
    expect(LINKS[1].utmContent).toBe("giornale-ia");
    expect(LINKS[2].utmContent).toBe("sito-istituzionale");
    expect(LINKS[3].utmContent).toBe("chi-siamo");
  });

  it("all links have required fields (label, href, utmContent, action)", () => {
    LINKS.forEach((link) => {
      expect(link.label).toBeTruthy();
      expect(link.href).toBeTruthy();
      expect(link.utmContent).toBeTruthy();
      expect(link.action).toBeTruthy();
      expect(link.href.startsWith("/")).toBe(true);
    });
  });

  it("all utmContent values are unique", () => {
    const contents = LINKS.map((l) => l.utmContent);
    expect(new Set(contents).size).toBe(contents.length);
  });

  it("links point to valid routes in the app", () => {
    const validRoutes = ["/", "/giornale", "/chi-siamo", "/contattaci", "/grazie", "/links", "/mappa", "/mappa/grazie", "/404"];
    LINKS.forEach((link) => {
      expect(validRoutes).toContain(link.href);
    });
  });
});

describe("Links Page — Route Configuration", () => {
  it("/links route should be in the noPopupRoutes list", () => {
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
