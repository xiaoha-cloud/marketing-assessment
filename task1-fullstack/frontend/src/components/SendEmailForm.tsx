import { type FormEvent, useState } from "react";
import { sendCampaignEmail } from "../api/campaignApi.js";

type SendEmailFormProps = {
  campaignId: number;
};

export function SendEmailForm({ campaignId }: SendEmailFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setFeedback(null);
    try {
      await sendCampaignEmail(campaignId, email);
      setStatus("success");
      setFeedback("Email sent successfully.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setFeedback(err instanceof Error ? err.message : "Could not send email");
    }
  }

  return (
    <form className="send-email-form" onSubmit={(e) => void handleSubmit(e)}>
      <label htmlFor={`recipient-${campaignId}`}>Send campaign email to</label>
      <div className="send-email-form__row">
        <input
          id={`recipient-${campaignId}`}
          type="email"
          name="recipientEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="recipient@example.com"
          required
          disabled={status === "sending"}
          autoComplete="email"
        />
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send email"}
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
