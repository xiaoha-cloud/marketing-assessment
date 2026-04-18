/**
 * Coordinates email sending using the email provider layer.
 */

import { NodemailerProvider } from "../email/nodemailerProvider.js";
import { buildCampaignEmailHtml, buildCampaignEmailText } from "../email/emailTemplateBuilder.js";
import type { EmailProvider } from "../email/emailProvider.js";
import type { CampaignRow } from "../types/campaign.js";
import type { SendCampaignEmailResult } from "../types/email.js";

let providerInstance: EmailProvider | null = null;

function getProvider(): EmailProvider {
  if (providerInstance === null) {
    providerInstance = new NodemailerProvider();
  }
  return providerInstance;
}

export async function sendCampaignEmail(params: {
  campaignRow: CampaignRow;
  recipientEmail: string;
  landingUrl: string;
}): Promise<SendCampaignEmailResult> {
  const { campaignRow, recipientEmail, landingUrl } = params;
  const templateParams = {
    campaignName: campaignRow.name,
    landingUrl,
    ctaText: campaignRow.cta_text,
  };
  const html = buildCampaignEmailHtml(templateParams);
  const text = buildCampaignEmailText(templateParams);
  try {
    const result = await getProvider().send({
      to: recipientEmail,
      subject: campaignRow.email_subject,
      html,
      text,
    });
    return {
      ok: true,
      previewUrl: result.previewUrl,
      messageId: result.messageId,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    return { ok: false, code: "EMAIL_SEND_FAILED", message };
  }
}
