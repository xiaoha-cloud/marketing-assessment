import { Router } from "express";
import { getLandingBySlugHandler } from "../controllers/landingController.js";

export const landingRouter = Router();

landingRouter.get("/:slug", getLandingBySlugHandler);
