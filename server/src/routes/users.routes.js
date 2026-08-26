import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";

const router = Router();

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  passwordHash: z.string().min(1), // temporary — real hashing comes on Day 9
});

// POST /users — create a user
router.post("/", async (req, res, next) => {
  try {
    const data = createUserSchema.parse(req.body);

    const user = await prisma.user.create({
      data,
      select: { id: true, email: true, name: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.issues });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already in use" });
    }
    next(err);
  }
});

// GET /users/:id — fetch a single user
router.get("/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

export default router;