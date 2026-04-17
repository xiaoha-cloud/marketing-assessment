/**
 * HTTP handlers for campaign read endpoints. Thin: validate input, call service, map status and JSON envelope.
 */

import type { RequestHandler } from "express";
import * as campaignService from "../services/campaignService.js";

export const listCampaignsHandler: RequestHandler = (_req, res, next) => {
  try {
    const data = campaignService.getAllCampaigns();
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};

export const getCampaignByIdHandler: RequestHandler = (req, res, next) => {
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

    const campaign = campaignService.getCampaignById(id);
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
