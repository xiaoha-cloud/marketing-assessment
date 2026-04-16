import { Router } from "express";
import {
  getCampaignByIdHandler,
  listCampaignsHandler,
} from "../controllers/campaignController.js";

export const campaignRouter = Router();

campaignRouter.get("/", listCampaignsHandler);
campaignRouter.get("/:id", getCampaignByIdHandler);
