/**
 * HTTP handlers for public landing data (slug-based lookup).
 */

import type { RequestHandler } from "express";
import * as campaignService from "../services/campaignService.js";

export const getLandingBySlugHandler: RequestHandler = (req, res, next) => {
  try {
    const slug = req.params.slug;
    if (typeof slug !== "string" || slug.trim() === "") {
      res.status(404).json({
        error: {
          code: "CAMPAIGN_NOT_FOUND",
          message: "Campaign not found",
        },
      });
      return;
    }

    const data = campaignService.getLandingCampaignBySlug(slug);
    if (data === null) {
      res.status(404).json({
        error: {
          code: "CAMPAIGN_NOT_FOUND",
          message: "Campaign not found",
        },
      });
      return;
    }

    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};
