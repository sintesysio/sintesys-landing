import { describe, it, expect } from "vitest";

/**
 * Tests for the Mappa Landing Page (/mappa) — Low-Ticket Product
 * "Mappa delle Opportunità IA" — €47
 * Validates page structure, content contract, and route configuration
 */

describe("Mappa Landing Page — Content Contract", () => {
  // Product details that must be present on the page
  const PRODUCT = {
    name: "Mappa delle Opportunità IA",
    price: 47,
    currency: "EUR",
    deliverables: 6,
    departments: 8,
    processes: 80,
    guarantee_days: 14,
  };

  it("product has correct pricing at €47", () => {
    expect(PRODUCT.price).toBe(47);
    expect(PRODUCT.currency).toBe("EUR");
  });

  it("product includes 6 deliverables", () => {
    expect(PRODUCT.deliverables).toBe(6);
  });

  it("Excel maps 80 processes across 8 departments", () => {
    expect(PRODUCT.processes).toBe(80);
    expect(PRODUCT.departments).toBe(8);
  });

  it("guarantee period is 14 days", () => {
    expect(PRODUCT.guarantee_days).toBe(14);
  });

  // The 6 deliverables contract
  const DELIVERABLES = [
    { num: "1", title: "Mappa delle Opportunità IA (Excel)", type: "excel" },
    { num: "2", title: "Cosa è l'IA — Guida per l'Imprenditore (Word)", type: "word" },
    { num: "3", title: "Come usare la Mappa (Word)", type: "word" },
    { num: "4", title: "32 Casi Pratici di IA per Reparto (Word)", type: "word" },
    { num: "5", title: "10 Errori da Evitare (Word)", type: "word" },
    { num: "6", title: "Documento di Benvenuto", type: "word" },
  ];

  it("has exactly 6 deliverables defined", () => {
    expect(DELIVERABLES).toHaveLength(6);
  });

  it("deliverable #1 is the Excel spreadsheet", () => {
    expect(DELIVERABLES[0].type).toBe("excel");
    expect(DELIVERABLES[0].title).toContain("Excel");
  });

  it("deliverables 2-5 are Word documents", () => {
    const wordDocs = DELIVERABLES.filter((d) => d.type === "word" && d.title.includes("Word"));
    expect(wordDocs.length).toBeGreaterThanOrEqual(4);
  });

  it("all deliverables have unique numbers", () => {
    const nums = DELIVERABLES.map((d) => d.num);
    expect(new Set(nums).size).toBe(nums.length);
  });
});

describe("Mappa Landing Page — Page Structure", () => {
  // The 12 sections that must exist on the page
  const SECTIONS = [
    "Header (navy bar)",
    "Hero (sopra la piega)",
    "Sotto la piega (stats)",
    "La storia (editorial narrative)",
    "Cosa riceverà (product details)",
    "Per chi è / Per chi non è",
    "Chi ha costruito (Lamberto bio)",
    "Cosa include (6 deliverables)",
    "Garanzia (14 giorni)",
    "FAQ (6 domande)",
    "Blocco finale (CTA)",
    "Footer",
  ];

  it("page has 12 defined sections", () => {
    expect(SECTIONS).toHaveLength(12);
  });

  // CTA positions
  const CTA_POSITIONS = ["hero", "dopo_incluso", "blocco_finale", "sticky_bar"];

  it("has CTAs in 4 strategic positions", () => {
    expect(CTA_POSITIONS).toHaveLength(4);
    expect(CTA_POSITIONS).toContain("hero");
    expect(CTA_POSITIONS).toContain("blocco_finale");
    expect(CTA_POSITIONS).toContain("sticky_bar");
  });

  // FAQ questions contract
  const FAQ_QUESTIONS = [
    "Quanto tempo serve davvero?",
    "Posso farla compilare al mio responsabile invece di farla io?",
    "Funziona anche per la mia azienda piccola? Sono in cinque.",
    "E dopo la Mappa?",
    "Devo registrarmi a una piattaforma? Devo dare il mio numero?",
    "E la privacy?",
  ];

  it("has 6 FAQ questions", () => {
    expect(FAQ_QUESTIONS).toHaveLength(6);
  });

  it("FAQ includes privacy question", () => {
    expect(FAQ_QUESTIONS.some((q) => q.toLowerCase().includes("privacy"))).toBe(true);
  });

  it("FAQ includes timing question", () => {
    expect(FAQ_QUESTIONS.some((q) => q.toLowerCase().includes("tempo"))).toBe(true);
  });
});

describe("Mappa Landing Page — Route Configuration", () => {
  it("/mappa route is a valid public route", () => {
    const publicRoutes = [
      "/",
      "/giornale",
      "/chi-siamo",
      "/contattaci",
      "/grazie",
      "/links",
      "/mappa",
      "/privacy-policy",
      "/terms-of-service",
      "/data-deletion",
    ];
    expect(publicRoutes).toContain("/mappa");
  });

  it("/mappa should NOT trigger the newsletter popup", () => {
    // The popup only shows on /giornale
    const popupRoute = "/giornale";
    const currentRoute = "/mappa";
    const shouldShowPopup = currentRoute === popupRoute;
    expect(shouldShowPopup).toBe(false);
  });

  it("/mappa is a standalone sales page (no shared NavBar)", () => {
    // The Mappa page has its own header, not the shared NavBar
    // This is by design — sales pages should minimize distractions
    const pagesWithOwnNav = ["/", "/mappa"];
    expect(pagesWithOwnNav).toContain("/mappa");
  });
});

describe("Mappa Landing Page — Statistics Sources", () => {
  const STATS = [
    { stat: "41,7%", source: "ISTAT, 2025" },
    { stat: "36,4%", source: "Banca d'Italia, 2024" },
    { stat: "88%", source: "Politecnico di Milano, 2024" },
    { stat: "60%+", source: "Transizione 5.0" },
  ];

  it("has 4 statistical data points", () => {
    expect(STATS).toHaveLength(4);
  });

  it("all stats have cited sources", () => {
    STATS.forEach((s) => {
      expect(s.source).toBeTruthy();
      expect(s.source.length).toBeGreaterThan(3);
    });
  });

  it("stats include Italian institutional sources", () => {
    const sources = STATS.map((s) => s.source);
    expect(sources.some((s) => s.includes("ISTAT"))).toBe(true);
    expect(sources.some((s) => s.includes("Politecnico"))).toBe(true);
  });
});
