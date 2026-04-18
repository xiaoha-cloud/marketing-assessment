import { Router } from "express";
import {
  getCampaignByIdHandler,
  listCampaignsHandler,
  sendCampaignEmailHandler,
} from "../controllers/campaignController.js";

export const campaignRouter = Router();

campaignRouter.post("/:id/send", sendCampaignEmailHandler);
campaignRouter.get("/", listCampaignsHandler);
campaignRouter.get("/:id", getCampaignByIdHandler);
