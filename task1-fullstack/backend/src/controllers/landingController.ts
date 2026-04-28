/**
 * HTTP handlers for public landing data (slug-based lookup).
 */

import type { RequestHandler } from "express";
import * as campaignService from "../services/campaignService.js";
import * as submissionService from "../services/submissionService.js";
import { parseLandingSubmissionRequest } from "../validators/landingValidators.js";

export const getLandingBySlugHandler: RequestHandler = async (req, res, next) => {
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

    const data = await campaignService.getLandingCampaignBySlug(slug);
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

export const postLandingSubmitHandler: RequestHandler = async (req, res, next) => {
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

    const parsed = parseLandingSubmissionRequest(req.body);
    if (!parsed.ok) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.message,
        },
      });
      return;
    }

    const result = await submissionService.createLandingSubmission(slug, parsed.value);
    if (result.ok === false) {
      res.status(404).json({
        error: {
          code: "CAMPAIGN_NOT_FOUND",
          message: "Campaign not found",
        },
      });
      return;
    }

    res.status(201).json({
      data: {
        id: result.submissionId,
      },
    });
  } catch (err) {
    next(err);
  }
};
