import { Router } from "express";
import {
  exportSubmissionsCsvHandler,
  listSubmissionsHandler,
} from "../controllers/submissionController.js";

export const submissionRouter = Router();

submissionRouter.get("/export", exportSubmissionsCsvHandler);
submissionRouter.get("/", listSubmissionsHandler);
