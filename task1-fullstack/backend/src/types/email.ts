/**
 * Email dispatch and provider contracts (no transport implementation here).
 */

/** Internal request to build and queue a campaign email send. */
export type EmailDispatchRequest = {
  campaignId: number;
  recipientEmail: string;
};

/** Input to the service that sends a campaign email. */
export type SendCampaignEmailInput = {
  campaignId: number;
  recipientEmail: string;
};

export type SendCampaignEmailResult =
  | {
      ok: true;
      messageId?: string;
      previewUrl?: string;
    }
  | {
      ok: false;
      code: "EMAIL_SEND_FAILED";
      message: string;
    };

/** Normalized payload passed to the mail transport. */
export type EmailSendPayload = {
  to: string;
  subject: string;
  text?: string;
  html: string;
};

export type EmailProviderResult =
  | {
      ok: true;
      messageId?: string;
      previewUrl?: string;
    }
  | {
      ok: false;
      errorMessage: string;
    };

export type EmailProvider = {
  send(payload: EmailSendPayload): Promise<EmailProviderResult>;
};
