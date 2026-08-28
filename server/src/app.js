import express from "express";
import cors from "cors";
import "dotenv/config";

import healthRoutes from "./routes/health.routes.js";
import userRoutes from "./routes/users.routes.js";
import workoutsRoutes from "./routes/workouts.routes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRoutes);
app.use("/users", userRoutes);
app.use("/workouts", workoutsRoutes);
// Catch-all for unknown routes
app.use(notFound);

// Centralized error handler — must be last
app.use(errorHandler);

export default app;