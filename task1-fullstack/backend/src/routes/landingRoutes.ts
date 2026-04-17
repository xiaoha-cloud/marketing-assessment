import { Router } from "express";
import {
  getLandingBySlugHandler,
  postLandingSubmitHandler,
} from "../controllers/landingController.js";

export const landingRouter = Router();

landingRouter.post("/:slug/submit", postLandingSubmitHandler);
landingRouter.get("/:slug", getLandingBySlugHandler);
