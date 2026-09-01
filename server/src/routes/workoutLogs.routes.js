import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth); // All routes below require authentication

const setEntrySchema = z.object({
  exerciseId: z.string().uuid(),
  reps: z.number().int().positive(),
  weight: z.number().nonnegative(),
  order: z.number().int().optional(),
});

const createLogSchema = z.object({
  workoutId: z.string().uuid(),
  performedAt: z.string().datetime().optional(),
  setEntries: z.array(setEntrySchema).min(1),
});

// POST /workout-logs — log a completed session with its sets
router.post("/", async (req, res, next) => {
  try {
    const data = createLogSchema.parse(req.body);

    const workout = await prisma.workout.findUnique({
      where: { id: data.workoutId },
    });
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    if (workout.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to log against this workout" });
    }

    const log = await prisma.workoutLog.create({
      data: {
        userId: req.user.id,
        workoutId: data.workoutId,
        ...(data.performedAt && { performedAt: new Date(data.performedAt) }),
        setEntries: {
          create: data.setEntries,
        },
      },
      include: {
        setEntries: { include: { exercise: true } },
        workout: { select: { name: true } },
      },
    });

    res.status(201).json(log);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.issues });
    }
    if (err.code === "P2003") {
      return res.status(400).json({ error: "userId, workoutId, or exerciseId does not exist" });
    }
    next(err);
  }
});

// GET /workout-logs/:id — fetch one session with full detail
router.get("/:id", async (req, res, next) => {
  try {
    const log = await prisma.workoutLog.findUnique({
      where: { id: req.params.id },
      include: {
        setEntries: { include: { exercise: true }, orderBy: { order: "asc" } },
        workout: { select: { name: true } },
      },
    });

    if (!log) {
      return res.status(404).json({ error: "Workout log not found" });
    }

    // ownership check
    if (log.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to view this log" });
    }

    res.status(200).json(log);
  } catch (err) {
    next(err);
  }
});

// GET /workout-logs?from=...&to=... — session history, optionally date-filtered
router.get("/", async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const logs = await prisma.workoutLog.findMany({
      where: {
        userId: req.user.id,
        ...(from || to
          ? {
              performedAt: {
                ...(from && { gte: new Date(from) }),
                ...(to && { lte: new Date(to) }),
              },
            }
          : {}),
      },
      include: {
        setEntries: { include: { exercise: true } },
        workout: { select: { name: true } },
      },
      orderBy: { performedAt: "desc" },
    });

    res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;