import type { EmailProvider, EmailSendInput } from "./emailProvider.js";

/**
 * Nodemailer + Ethereal implementation of EmailProvider.
 * Implemented in the email sending phase.
 */

export class NodemailerProvider implements EmailProvider {
  async send(_input: EmailSendInput): Promise<{ previewUrl?: string }> {
    await Promise.resolve();
    throw new Error("NodemailerProvider not implemented");
  }
}
