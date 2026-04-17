import { useCallback, useState } from "react";
import { sendCampaignEmail } from "../api/campaignApi.js";

export type SendEmailStatus = "idle" | "sending" | "success" | "error";

export type UseSendCampaignEmailResult = {
  recipientEmail: string;
  setRecipientEmail: (value: string) => void;
  status: SendEmailStatus;
  feedback: string | null;
  send: () => Promise<void>;
};

export function useSendCampaignEmail(campaignId: number): UseSendCampaignEmailResult {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [status, setStatus] = useState<SendEmailStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const send = useCallback(async () => {
    setStatus("sending");
    setFeedback(null);
    try {
      await sendCampaignEmail(campaignId, recipientEmail);
      setStatus("success");
      setFeedback("Email sent successfully.");
      setRecipientEmail("");
    } catch (err) {
      setStatus("error");
      setFeedback(err instanceof Error ? err.message : "Could not send email");
    }
  }, [campaignId, recipientEmail]);

  return {
    recipientEmail,
    setRecipientEmail,
    status,
    feedback,
    send,
  };
}
