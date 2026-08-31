import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import prisma from "../lib/prisma.js";

import jwt from "jsonwebtoken";

const router = Router();

const SALT_ROUNDS = 12;

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// POST /auth/register
router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
      },
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

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Deliberately vague error — don't reveal whether it was the email or password that was wrong
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    res.status(200).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.issues });
    }
    next(err);
  }
});

export default router;