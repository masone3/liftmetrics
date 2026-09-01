import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth); // All routes in this router require authentication

const exerciseSchema = z.object({
  name: z.string().min(1),
  targetMuscle: z.string().optional(),
  order: z.number().int().optional(),
});

const createWorkoutSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  exercises: z.array(exerciseSchema).optional().default([]),
});

// POST /workouts — create a workout, optionally with exercises nested in
router.post("/", async (req, res, next) => {
  try {
    const data = createWorkoutSchema.parse(req.body);

    const workout = await prisma.workout.create({
      data: {
        userId: req.user.id,
        name: data.name,
        description: data.description,
        exercises: {
          create: data.exercises,
        },
      },
      include: { exercises: true },
    });

    res.status(201).json(workout);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.issues });
    }
    if (err.code === "P2003") {
      return res.status(400).json({ error: "userId does not reference a real user" });
    }
    next(err);
  }
});

// GET /workouts/:id — fetch a workout with its exercises
router.get("/:id", async (req, res, next) => {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: req.params.id },
      include: { exercises: { orderBy: { order: "asc" } } },
    });

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    if (workout.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to view this workout" });
    }

    res.status(200).json(workout);
  } catch (err) {
    next(err);
  }
});

// GET /workouts?userId=... — list a user's workouts
router.get("/", async (req, res, next) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.user.id },
      include: { exercises: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(workouts);
  } catch (err) {
    next(err);
  }
});

// POST /workouts/:id/exercises — add an exercise to an existing workout
router.post("/:id/exercises", async (req, res, next) => {
  try {
    const data = exerciseSchema.parse(req.body);

    const exercise = await prisma.exercise.create({
      data: {
        ...data,
        workoutId: req.params.id,
      },
    });

    res.status(201).json(exercise);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.issues });
    }
    if (err.code === "P2003") {
      return res.status(400).json({ error: "workout not found" });
    }
    next(err);
  }
});

export default router;