import express from "express";
import cors from "cors";
import "dotenv/config";

import healthRoutes from "./routes/health.routes.js";
import userRoutes from "./routes/users.routes.js";
import workoutsRoutes from "./routes/workouts.routes.js";
import workoutLogsRoutes from "./routes/workoutLogs.routes.js";
import authRoutes from "./routes/auth.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authLimiter } from "./middleware/rateLimiters.js";
import helmet from "helmet";

const app = express();
app.use(helmet());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/users", userRoutes);
app.use("/workouts", workoutsRoutes);
app.use("/workout-logs", workoutLogsRoutes);
app.use("/stats", statsRoutes);
app.use(authLimiter); // Apply rate limiting to all routes
// Catch-all for unknown routes
app.use(notFound);

// Centralized error handler — must be last
app.use(errorHandler);

const allowedOrigins = process.env.NODE_ENV === "production"
  ? [process.env.CLIENT_URL] // set this on Render once you know your deployed frontend URL
  : ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins }));

export default app;