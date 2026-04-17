import { type FormEvent } from "react";
import { useSendCampaignEmail } from "../hooks/useSendCampaignEmail.js";

type SendEmailFormProps = {
  campaignId: number;
};

export function SendEmailForm({ campaignId }: SendEmailFormProps) {
  const { recipientEmail, setRecipientEmail, status, feedback, send } = useSendCampaignEmail(campaignId);
  const sending = status === "sending";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await send();
  }

  return (
    <form className="send-email-form" onSubmit={(e) => void handleSubmit(e)}>
      <span className="send-email-form__label" id={`send-label-${campaignId}`}>
        Send campaign email
      </span>
      <div className="send-email-form__row" role="group" aria-labelledby={`send-label-${campaignId}`}>
        <input
          id={`recipient-${campaignId}`}
          type="email"
          name="recipientEmail"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="recipient@example.com"
          required
          disabled={sending}
          autoComplete="email"
          aria-label="Recipient email"
        />
        <button type="submit" className="button button--cta button--compact" disabled={sending}>
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
      {feedback !== null ? (
        <p
          className={
            status === "error" ? "form-feedback form-feedback--error" : "form-feedback form-feedback--success"
          }
          role="status"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
