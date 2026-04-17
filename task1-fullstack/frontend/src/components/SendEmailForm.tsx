import { type FormEvent } from "react";
import { useSendCampaignEmail } from "../hooks/useSendCampaignEmail.js";
import { buttonCtaCompact } from "../ui/buttonClasses.js";

type SendEmailFormProps = {
  campaignId: number;
};

export function SendEmailForm({ campaignId }: SendEmailFormProps) {
  const {
    recipientEmail,
    setRecipientEmail,
    isSending,
    sendError,
    sendSuccessMessage,
    send,
  } = useSendCampaignEmail(campaignId);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await send();
  }

  const feedback = sendError ?? sendSuccessMessage;
  const feedbackIsError = sendError !== null;

  return (
    <form
      className="m-0 flex flex-col gap-1.5 border-0 p-0 text-[0.78rem]"
      aria-label="Send campaign email"
      onSubmit={(e) => void handleSubmit(e)}
    >
      <span
        className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-muted"
        id={`send-label-${campaignId}`}
      >
        Send campaign email
      </span>
      <div
        className="grid grid-cols-[1fr_auto] items-stretch gap-2"
        role="group"
        aria-labelledby={`send-label-${campaignId}`}
      >
        <input
          id={`recipient-${campaignId}`}
          type="email"
          name="recipientEmail"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="recipient@example.com"
          required
          disabled={isSending}
          autoComplete="email"
          aria-label="Recipient email"
          className="min-w-0 border border-ink bg-surface px-2 py-1.5 text-[0.82rem] text-ink outline-none ring-ink focus-visible:ring-2"
        />
        <button type="submit" className={buttonCtaCompact} disabled={isSending}>
          {isSending ? "Sending…" : "Send"}
        </button>
      </div>
      {feedback !== null ? (
        <p
          className={`m-0 mt-0.5 text-[0.75rem] ${feedbackIsError ? "text-error" : "text-success"}`}
          role="status"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
