import nodemailer from "nodemailer";
import type { EmailProvider, EmailSendInput, EmailSendResult } from "./emailProvider.js";

let etherealAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter === null) {
    if (etherealAccount === null) {
      etherealAccount = await nodemailer.createTestAccount();
    }
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: etherealAccount.user,
        pass: etherealAccount.pass,
      },
    });
  }
  return transporter;
}

/**
 * Nodemailer + Ethereal implementation of EmailProvider.
 */
export class NodemailerProvider implements EmailProvider {
  async send(input: EmailSendInput): Promise<EmailSendResult> {
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from: '"Marketing Campaigns" <campaigns@example.com>',
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    const rawPreview = nodemailer.getTestMessageUrl(info);
    const previewUrl = typeof rawPreview === "string" ? rawPreview : undefined;
    if (previewUrl !== undefined) {
      console.log("Ethereal preview URL:", previewUrl);
    }
    return {
      previewUrl,
      messageId: typeof info.messageId === "string" ? info.messageId : undefined,
    };
  }
}
