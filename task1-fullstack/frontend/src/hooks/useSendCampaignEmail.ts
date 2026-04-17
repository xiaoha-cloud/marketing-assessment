import { useCallback, useState } from "react";
import { sendCampaignEmail } from "../api/campaignApi.js";

export type UseSendCampaignEmailResult = {
  recipientEmail: string;
  setRecipientEmail: (value: string) => void;
  isSending: boolean;
  sendError: string | null;
  sendSuccessMessage: string | null;
  send: () => Promise<void>;
};

/**
 * Sends a campaign email for one row on the campaign list.
 */
export function useSendCampaignEmail(campaignId: number): UseSendCampaignEmailResult {
  const [recipientEmail, setRecipientEmailState] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  const setRecipientEmail = useCallback((value: string) => {
    setRecipientEmailState(value);
    setSendError(null);
    setSendSuccessMessage(null);
  }, []);

  const send = useCallback(async () => {
    setIsSending(true);
    setSendError(null);
    setSendSuccessMessage(null);
    try {
      await sendCampaignEmail(campaignId, recipientEmail);
      setSendSuccessMessage("Email sent successfully.");
      setRecipientEmail("");
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Could not send email");
    } finally {
      setIsSending(false);
    }
  }, [campaignId, recipientEmail]);

  return {
    recipientEmail,
    setRecipientEmail,
    isSending,
    sendError,
    sendSuccessMessage,
    send,
  };
}
