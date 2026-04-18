import { useCallback, useState } from "react";
import { sendCampaignEmail } from "../api/campaignApi.js";

export type UseSendCampaignEmailResult = {
  recipientEmail: string;
  setRecipientEmail: (value: string) => void;
  isSending: boolean;
  sendError: string | null;
  sendSuccessMessage: string | null;
  /** Set when `window.open` was blocked or no preview was opened; show as fallback link in UI. */
  previewUrlFallback: string | null;
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
  const [previewUrlFallback, setPreviewUrlFallback] = useState<string | null>(null);

  const setRecipientEmail = useCallback((value: string) => {
    setRecipientEmailState(value);
    setSendError(null);
    setSendSuccessMessage(null);
    setPreviewUrlFallback(null);
  }, []);

  const send = useCallback(async () => {
    setIsSending(true);
    setSendError(null);
    setSendSuccessMessage(null);
    setPreviewUrlFallback(null);
    try {
      const result = await sendCampaignEmail(campaignId, recipientEmail);
      setSendSuccessMessage("Email sent successfully.");
      setRecipientEmailState("");
      const previewUrl = result.previewUrl;
      if (typeof previewUrl === "string" && previewUrl.length > 0) {
        const opened = window.open(previewUrl, "_blank", "noopener,noreferrer");
        if (opened === null) {
          setPreviewUrlFallback(previewUrl);
        }
      }
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
    previewUrlFallback,
    send,
  };
}
