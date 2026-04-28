/**
 * HTTP handlers for campaign read endpoints. Thin: validate input, call service, map status and JSON envelope.
 */

import type { RequestHandler } from "express";
import * as campaignService from "../services/campaignService.js";
import { isRecord } from "../validators/commonValidators.js";

export const listCampaignsHandler: RequestHandler = async (_req, res, next) => {
  try {
    const data = await campaignService.getAllCampaigns();
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};

export const getCampaignByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const raw = req.params.id;
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        error: {
          code: "INVALID_CAMPAIGN_ID",
          message: "Campaign id must be a positive integer",
        },
      });
      return;
    }

    const campaign = await campaignService.getCampaignById(id);
    if (campaign === null) {
      res.status(404).json({
        error: {
          code: "CAMPAIGN_NOT_FOUND",
          message: "Campaign not found",
        },
      });
      return;
    }

    res.status(200).json({ data: campaign });
  } catch (err) {
    next(err);
  }
};

export const sendCampaignEmailHandler: RequestHandler = async (req, res, next) => {
  try {
    const raw = req.params.id;
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        error: {
          code: "INVALID_CAMPAIGN_ID",
          message: "Campaign id must be a positive integer",
        },
      });
      return;
    }
    if (!isRecord(req.body) || typeof req.body.recipientEmail !== "string") {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "recipientEmail is required as a string",
        },
      });
      return;
    }
    const outcome = await campaignService.sendCampaignEmail(id, req.body.recipientEmail);
    if (!outcome.ok) {
      const status =
        outcome.code === "CAMPAIGN_NOT_FOUND"
          ? 404
          : outcome.code === "INVALID_RECIPIENT_EMAIL"
            ? 400
            : 502;
      res.status(status).json({ error: { code: outcome.code, message: outcome.message } });
      return;
    }
    res.status(200).json({
      data: {
        previewUrl: outcome.previewUrl,
        landingUrl: outcome.landingUrl,
        messageId: outcome.messageId,
      },
    });
  } catch (err) {
    next(err);
  }
};
