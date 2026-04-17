/**
 * HTTP handlers for submission listing (internal dashboard).
 */

import type { RequestHandler } from "express";
import * as submissionService from "../services/submissionService.js";

export const listSubmissionsHandler: RequestHandler = (_req, res, next) => {
  try {
    const data = submissionService.getAllSubmissions();
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};
