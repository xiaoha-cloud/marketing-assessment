import { Router } from "express";
import { listSubmissionsHandler } from "../controllers/submissionController.js";

export const submissionRouter = Router();

submissionRouter.get("/", listSubmissionsHandler);
