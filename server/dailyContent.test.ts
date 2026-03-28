import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  getDailyEdition: vi.fn().mockResolvedValue({
    id: 1,
    editionDate: "2026-03-28",
    editionNumber: 1,
    headline: "Riprendi il controllo della tua azienda.",
    editorialP1: "L'88% degli imprenditori italiani sa di dover innovare.",
    editorialP2: "Noi parliamo la tua lingua: Marginalità, Controllo.",
    editorialP3: "Iscrivendoti riceverai materiali strategici.",
    imageCaption: "L'IA non è più un'opzione.",
    statsTitle: "Il paradosso delle PMI italiane.",
    stat1Number: 88,
    stat1Suffix: "%",
    stat1Label: "vuole innovare",
    stat1Desc: "degli imprenditori dichiara di voler innovare",
    stat1Source: "Politecnico di Milano",
    stat2Number: 26,
    stat2Suffix: "%",
    stat2Label: "agisce davvero",
    stat2Desc: "ha implementato soluzioni digitali",
    stat2Source: "Politecnico di Milano",
    stat3Number: 42,
    stat3Suffix: "%",
    stat3Label: "fatica col credito",
    stat3Desc: "ha difficoltà di accesso al credito",
    stat3Source: "Banca d'Italia",
    quote: "Solo strategia pura, da imprenditore a imprenditore.",
    ctaTitle: "Non restare indietro.",
    ctaText: "Iscriviti per ricevere analisi esclusive.",
    createdAt: new Date(),
  }),
  getLatestEdition: vi.fn().mockResolvedValue(null),
  createLead: vi.fn(),
  getLeadByEmail: vi.fn(),
  getAllLeads: vi.fn().mockResolvedValue([]),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("dailyContent.today", () => {
  it("returns formatted daily content when edition exists", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dailyContent.today();

    expect(result).not.toBeNull();
    expect(result!.headline).toBe("Riprendi il controllo della tua azienda.");
    expect(result!.editionNumber).toBe("001");
    expect(result!.dateFormatted).toMatch(/\d+ \w+ \d{4}/); // e.g. "28 Marzo 2026"
    expect(result!.stats).toHaveLength(3);
    expect(result!.stats[0].number).toBe(88);
    expect(result!.stats[0].suffix).toBe("%");
    expect(result!.stats[0].label).toBe("vuole innovare");
    expect(result!.stats[1].number).toBe(26);
    expect(result!.stats[2].number).toBe(42);
    expect(result!.quote).toBe("Solo strategia pura, da imprenditore a imprenditore.");
    expect(result!.ctaTitle).toBe("Non restare indietro.");
    expect(result!.editorialP1).toContain("imprenditori italiani");
    expect(result!.editorialP2).toContain("Marginalità");
    expect(result!.editorialP3).toContain("materiali strategici");
    expect(result!.imageCaption).toContain("IA");
    expect(result!.statsTitle).toContain("paradosso");
  });

  it("returns null when no edition exists", async () => {
    const { getDailyEdition, getLatestEdition } = await import("./db");
    (getDailyEdition as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);
    (getLatestEdition as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dailyContent.today();
    expect(result).toBeNull();
  });

  it("falls back to latest edition when today has no content", async () => {
    const { getDailyEdition, getLatestEdition } = await import("./db");
    (getDailyEdition as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);
    (getLatestEdition as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: 5,
      editionDate: "2026-03-25",
      editionNumber: 5,
      headline: "Fallback headline.",
      editorialP1: "Fallback P1.",
      editorialP2: "Fallback P2.",
      editorialP3: "Fallback P3.",
      imageCaption: "Fallback caption.",
      statsTitle: "Fallback stats.",
      stat1Number: 50,
      stat1Suffix: "%",
      stat1Label: "label1",
      stat1Desc: "desc1",
      stat1Source: "source1",
      stat2Number: 30,
      stat2Suffix: "%",
      stat2Label: "label2",
      stat2Desc: "desc2",
      stat2Source: "source2",
      stat3Number: 20,
      stat3Suffix: "%",
      stat3Label: "label3",
      stat3Desc: "desc3",
      stat3Source: "source3",
      quote: "Fallback quote.",
      ctaTitle: "Fallback CTA.",
      ctaText: "Fallback CTA text.",
      createdAt: new Date(),
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dailyContent.today();
    expect(result).not.toBeNull();
    expect(result!.headline).toBe("Fallback headline.");
    expect(result!.editionNumber).toBe("005");
  });
});
