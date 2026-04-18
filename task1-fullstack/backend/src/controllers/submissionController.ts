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

export const exportSubmissionsCsvHandler: RequestHandler = (_req, res, next) => {
  try {
    const csv = submissionService.exportSubmissionsCsv();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="submissions.csv"');
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};
