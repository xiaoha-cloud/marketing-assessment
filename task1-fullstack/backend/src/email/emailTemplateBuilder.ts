/**
 * Builds HTML/text bodies for campaign emails (CTA links, etc.).
 */

export type CampaignEmailTemplateParams = {
  campaignName: string;
  landingUrl: string;
  ctaText: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildCampaignEmailHtml(params: CampaignEmailTemplateParams): string {
  const name = escapeHtml(params.campaignName);
  const cta = escapeHtml(params.ctaText);
  const url = escapeHtml(params.landingUrl);
  return `<!DOCTYPE html>
<html lang="en">
  <body>
    <p>Hello,</p>
    <p>You are invited to learn more about <strong>${name}</strong>.</p>
    <p><a href="${url}">${cta}</a></p>
  </body>
</html>`;
}

export function buildCampaignEmailText(params: CampaignEmailTemplateParams): string {
  return `Hello,

You are invited to learn more about ${params.campaignName}.

${params.ctaText}: ${params.landingUrl}
`;
}
