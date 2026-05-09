/**
 * Welcome Email — Newsletter Subscriber Onboarding
 *
 * Sends a branded welcome email to new newsletter subscribers immediately
 * after they sign up. Uses Mailchimp's campaign creation + send workflow
 * (one-off campaign to single recipient), same pattern as email-sequence.ts.
 *
 * The email:
 * - Welcomes the subscriber
 * - Sets expectations (weekly newsletter about IA for PMI)
 * - Mentions the Guida Transizione 5.0 as included resource
 * - Positions Lamberto as the expert behind Il Consigliere
 * - Includes CTA to explore the Mappa IA
 */

import crypto from "crypto";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || "";
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || "us14";
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || "";
const BASE_URL = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`;
const AUTH_HEADER = `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`;

function md5(str: string): string {
  return crypto.createHash("md5").update(str.toLowerCase().trim()).digest("hex");
}

/**
 * Generate the welcome email HTML content.
 * Styled to match Il Consigliere brand: navy (#1B2A4A), off-white (#FAFAF7), terracotta (#C4704B).
 */
function generateWelcomeHTML(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Benvenuto su Il Consigliere</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f2;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f2;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;width:100%;">
          
          <!-- Header Navy Bar -->
          <tr>
            <td style="background-color:#1B2A4A;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:700;color:#FAFAF7;letter-spacing:0.5px;">
                Il Consigliere
              </h1>
              <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(250,250,247,0.6);letter-spacing:2px;text-transform:uppercase;">
                L'Intelligenza Artificiale per la PMI Italiana
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B2A4A;line-height:1.3;">
                Benvenuto${firstName ? `, ${firstName}` : ""}.
              </h2>
              
              <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#333333;line-height:1.7;">
                Da oggi riceverà ogni settimana la nostra newsletter con strategie operative per integrare l'Intelligenza Artificiale nella Sua azienda.
              </p>

              <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#333333;line-height:1.7;">
                Niente teoria astratta. Solo metodi concreti, testati in 28 anni di esperienza in multinazionali come Nissan Italia, Cushman & Wakefield, Tishman Speyer e Brookfield — e adattati alla realtà delle PMI italiane con fatturato superiore a 1 milione di euro.
              </p>

              <!-- Divider -->
              <div style="border-top:2px solid #1B2A4A;margin:28px 0;width:60px;"></div>

              <h3 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;color:#1B2A4A;">
                Cosa riceverà:
              </h3>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="padding:6px 12px 6px 0;vertical-align:top;color:#C4704B;font-size:16px;">&#10003;</td>
                  <td style="padding:6px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#333333;line-height:1.6;">
                    <strong>Analisi settimanali</strong> su come l'IA sta trasformando le PMI italiane
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 12px 6px 0;vertical-align:top;color:#C4704B;font-size:16px;">&#10003;</td>
                  <td style="padding:6px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#333333;line-height:1.6;">
                    <strong>Incentivi governativi</strong> — Transizione 5.0 e fondi MIMIT per la digitalizzazione
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 12px 6px 0;vertical-align:top;color:#C4704B;font-size:16px;">&#10003;</td>
                  <td style="padding:6px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#333333;line-height:1.6;">
                    <strong>Casi studio reali</strong> di imprenditori che hanno ridotto costi e aumentato margini con l'IA
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 12px 6px 0;vertical-align:top;color:#C4704B;font-size:16px;">&#10003;</td>
                  <td style="padding:6px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#333333;line-height:1.6;">
                    <strong>Strumenti operativi</strong> per passare dall'intenzione all'azione in 90 giorni
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="border-top:1px solid #e5e5e0;margin:28px 0;"></div>

              <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#333333;line-height:1.7;">
                Come primo passo, Le consiglio di esplorare la <strong>Mappa delle Opportunità IA</strong>: 80 processi aziendali analizzati in 8 reparti, con priorità e impatto stimato per la Sua realtà.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="background-color:#C4704B;border-radius:0;">
                    <a href="https://www.ilconsigliere.io/mappa" target="_blank" style="display:inline-block;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;color:#FAFAF7;text-decoration:none;letter-spacing:1.5px;text-transform:uppercase;">
                      Scopra la Mappa IA →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#333333;line-height:1.7;">
                A presto,
              </p>
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1B2A4A;font-weight:700;">
                Lamberto Grinover
              </p>
              <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;">
                Fondatore, Il Consigliere
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1B2A4A;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(250,250,247,0.5);">
                © ${new Date().getFullYear()} Il Consigliere — Tutti i diritti riservati.
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(250,250,247,0.4);">
                <a href="https://www.ilconsigliere.io" style="color:rgba(250,250,247,0.6);text-decoration:underline;">ilconsigliere.io</a>
                &nbsp;|&nbsp;
                <a href="https://www.instagram.com/ilconsigliere.io/" style="color:rgba(250,250,247,0.6);text-decoration:underline;">Instagram</a>
                &nbsp;|&nbsp;
                <a href="*|UNSUB|*" style="color:rgba(250,250,247,0.6);text-decoration:underline;">Cancella iscrizione</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send a welcome email to a new newsletter subscriber.
 * Creates a one-off Mailchimp campaign with inline HTML content.
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ success: boolean; campaignId?: string; error?: string }> {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    console.warn("[WelcomeEmail] Missing Mailchimp credentials, skipping");
    return { success: false, error: "Missing Mailchimp credentials" };
  }

  const firstName = name.trim().split(/\s+/)[0] || "";

  try {
    // Step 1: Create a campaign targeting this specific subscriber
    const createRes = await fetch(`${BASE_URL}/campaigns`, {
      method: "POST",
      headers: { Authorization: AUTH_HEADER, "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "regular",
        recipients: {
          list_id: MAILCHIMP_LIST_ID,
          segment_opts: {
            match: "all",
            conditions: [{
              condition_type: "EmailAddress",
              field: "EMAIL",
              op: "is",
              value: email.toLowerCase().trim(),
            }],
          },
        },
        settings: {
          subject_line: `${firstName ? firstName + ", b" : "B"}envenuto su Il Consigliere`,
          title: `[Welcome] Benvenuto — ${email}`,
          from_name: "Lamberto Grinover",
          reply_to: "lamberto@ilconsigliere.io",
        },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      console.error(`[WelcomeEmail] Failed to create campaign:`, createRes.status, err);
      return { success: false, error: `Create campaign failed: ${createRes.status}` };
    }

    const campaign = await createRes.json();
    const campaignId = campaign.id;

    // Step 2: Set the campaign content (inline HTML)
    const contentRes = await fetch(`${BASE_URL}/campaigns/${campaignId}/content`, {
      method: "PUT",
      headers: { Authorization: AUTH_HEADER, "Content-Type": "application/json" },
      body: JSON.stringify({
        html: generateWelcomeHTML(firstName),
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!contentRes.ok) {
      const err = await contentRes.json().catch(() => ({}));
      console.error(`[WelcomeEmail] Failed to set content for campaign ${campaignId}:`, contentRes.status, err);
      return { success: false, campaignId, error: `Set content failed: ${contentRes.status}` };
    }

    // Step 3: Send the campaign
    const sendRes = await fetch(`${BASE_URL}/campaigns/${campaignId}/actions/send`, {
      method: "POST",
      headers: { Authorization: AUTH_HEADER, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
    });

    if (!sendRes.ok) {
      const err = await sendRes.json().catch(() => ({}));
      console.error(`[WelcomeEmail] Failed to send campaign ${campaignId}:`, sendRes.status, err);
      return { success: false, campaignId, error: `Send failed: ${sendRes.status}` };
    }

    console.log(`[WelcomeEmail] ✓ Welcome email sent to ${email} (campaign: ${campaignId})`);
    return { success: true, campaignId };
  } catch (err) {
    console.error(`[WelcomeEmail] Error sending welcome to ${email}:`, err);
    return { success: false, error: String(err) };
  }
}
