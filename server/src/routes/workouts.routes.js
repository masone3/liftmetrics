import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";

const router = Router();

const exerciseSchema = z.object({
  name: z.string().min(1),
  targetMuscle: z.string().optional(),
  order: z.number().int().optional(),
});

const createWorkoutSchema = z.object({
  userId: z.string().uuid(),
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
        userId: data.userId,
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

    res.status(200).json(workout);
  } catch (err) {
    next(err);
  }
});

// GET /workouts?userId=... — list a user's workouts
router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId query param is required" });
    }

    const workouts = await prisma.workout.findMany({
      where: { userId },
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