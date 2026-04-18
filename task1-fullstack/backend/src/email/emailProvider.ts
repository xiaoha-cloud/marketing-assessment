/**
 * Abstraction over outbound email transport.
 * Implemented in the email sending phase.
 */

export type EmailSendInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export type EmailSendResult = {
  previewUrl?: string;
  messageId?: string;
};

export interface EmailProvider {
  send(input: EmailSendInput): Promise<EmailSendResult>;
}
