import express from "express";
import cors from "cors";
import "dotenv/config";

import healthRoutes from "./routes/health.routes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRoutes);

// Catch-all for unknown routes
app.use(notFound);

// Centralized error handler — must be last
app.use(errorHandler);

export default app;