import express from "express";
import { healthRouter } from "./routes/healthRoutes.js";
import { campaignRouter } from "./routes/campaignRoutes.js";
import { landingRouter } from "./routes/landingRoutes.js";
import { submissionRouter } from "./routes/submissionRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";

export const app = express();

app.use(requestLogger);
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/campaigns", campaignRouter);
app.use("/api/landing", landingRouter);
app.use("/api/submissions", submissionRouter);

app.use(notFoundHandler);
app.use(errorHandler);
