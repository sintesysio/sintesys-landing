import { describe, it, expect } from "vitest";
import { PRODUCTS } from "./stripe-products";

describe("Stripe Products Configuration", () => {
  it("should have mappa product with correct launch price €49,50", () => {
    expect(PRODUCTS.mappa).toBeDefined();
    expect(PRODUCTS.mappa.priceEurCents).toBe(4950);
    expect(PRODUCTS.mappa.currency).toBe("eur");
    expect(PRODUCTS.mappa.name).toBe("Mappa delle Opportunità IA");
  });

  it("should have mappa regular price €129,90", () => {
    expect(PRODUCTS.mappa.regularPriceEurCents).toBe(12990);
  });

  it("should have sessioneDiagnosi standalone launch price €197", () => {
    expect(PRODUCTS.sessioneDiagnosi).toBeDefined();
    expect(PRODUCTS.sessioneDiagnosi.priceEurCents).toBe(19700);
    expect(PRODUCTS.sessioneDiagnosi.currency).toBe("eur");
    expect(PRODUCTS.sessioneDiagnosi.name).toContain("Sessione Diagnosi");
  });

  it("should have sessioneDiagnosi bump price €147", () => {
    expect(PRODUCTS.sessioneDiagnosi.bumpPriceEurCents).toBe(14700);
  });

  it("should have sessioneDiagnosi regular price €247", () => {
    expect(PRODUCTS.sessioneDiagnosi.regularPriceEurCents).toBe(24700);
  });

  it("should have product metadata with correct keys", () => {
    expect(PRODUCTS.mappa.metadata.product_key).toBe("mappa_opportunita_ia");
    expect(PRODUCTS.mappa.metadata.type).toBe("low_ticket");
    expect(PRODUCTS.sessioneDiagnosi.metadata.product_key).toBe("sessione_diagnosi_ia");
    expect(PRODUCTS.sessioneDiagnosi.metadata.type).toBe("order_bump");
  });

  it("mappa launch price should be €49.50", () => {
    expect(PRODUCTS.mappa.priceEurCents / 100).toBe(49.5);
  });

  it("sessioneDiagnosi standalone price should be €197.00", () => {
    expect(PRODUCTS.sessioneDiagnosi.priceEurCents / 100).toBe(197);
  });

  it("combined order (mappa + bump) should total €196.50", () => {
    const total = (PRODUCTS.mappa.priceEurCents + PRODUCTS.sessioneDiagnosi.bumpPriceEurCents) / 100;
    expect(total).toBe(196.5);
  });
});

describe("Stripe Checkout API Endpoint", () => {
  it("should return checkout URL from /api/stripe/create-checkout", async () => {
    const res = await fetch("http://localhost:3000/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ includeOrderBump: false }),
    });
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data.url).toBeDefined();
    expect(data.url).toContain("checkout.stripe.com");
    expect(data.sessionId).toBeDefined();
    expect(data.sessionId).toMatch(/^cs_test_/);
  });

  it("should return checkout URL with order bump", async () => {
    const res = await fetch("http://localhost:3000/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        includeOrderBump: true,
        customerEmail: "test@example.com",
        customerName: "Test User",
      }),
    });
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data.url).toBeDefined();
    expect(data.url).toContain("checkout.stripe.com");
    expect(data.sessionId).toMatch(/^cs_test_/);
  });
});
