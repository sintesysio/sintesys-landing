import { describe, it, expect } from "vitest";

const NOTION_BASE_URL = "https://api.notion.com/v1";
const NOTION_API_VERSION = "2022-06-28";
const DATA_SOURCE_ID = "f9c3c788-4339-83fd-8bab-01b3b4e807fe";

function getHeaders() {
  const token = process.env.NOTION_API_KEY;
  if (!token) throw new Error("NOTION_API_KEY not set");
  return {
    "Authorization": `Bearer ${token}`,
    "Notion-Version": NOTION_API_VERSION,
    "Content-Type": "application/json",
  };
}

const hasNotionKey = process.env.NOTION_API_KEY?.startsWith("ntn_");

describe.skipIf(!hasNotionKey)("Notion CRM Integration", () => {
  it("should validate NOTION_API_KEY by fetching user info", async () => {
    const response = await fetch(`${NOTION_BASE_URL}/users/me`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Notion] Status: ${response.status}, Body: ${errorBody}`);
    }
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.type).toBe("bot");
    console.log(`[Notion] Bot name: ${data.name}`);
  }, 15000);

  it("should have access to the CRM database", async () => {
    const response = await fetch(`${NOTION_BASE_URL}/databases/${DATA_SOURCE_ID}`, {
      headers: getHeaders(),
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.id).toBeDefined();
    console.log(`[Notion] Database title: ${data.title?.[0]?.plain_text}`);
  }, 15000);

  it("should be able to query the CRM database", async () => {
    const response = await fetch(`${NOTION_BASE_URL}/databases/${DATA_SOURCE_ID}/query`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ page_size: 1 }),
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.results).toBeDefined();
    console.log(`[Notion] CRM has ${data.results.length} entries (showing max 1)`);
  }, 15000);
});
