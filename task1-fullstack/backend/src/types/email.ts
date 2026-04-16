/**
 * Types used by the email service layer (beyond EmailProvider).
 * Extend in the email sending phase.
 */

export type CampaignEmailPayload = {
  recipientEmail: string;
};
