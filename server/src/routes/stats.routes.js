import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

// GET /stats/volume — total volume (reps * weight) per session, over time
router.get("/volume", async (req, res, next) => {
  try {
    const logs = await prisma.workoutLog.findMany({
      where: { userId: req.user.id },
      include: { setEntries: true },
      orderBy: { performedAt: "asc" },
    });

    const volumeData = logs.map((log) => ({
      date: log.performedAt,
      workoutId: log.workoutId,
      volume: log.setEntries.reduce((sum, set) => sum + set.reps * set.weight, 0),
    }));

    res.status(200).json(volumeData);
  } catch (err) {
    next(err);
  }
});

// GET /stats/exercise/:exerciseId — max weight lifted per session, for one exercise
router.get("/exercise/:exerciseId", async (req, res, next) => {
  try {
    const setEntries = await prisma.setEntry.findMany({
      where: {
        exerciseId: req.params.exerciseId,
        workoutLog: { userId: req.user.id }, // ownership enforced via the relation
      },
      include: { workoutLog: true },
      orderBy: { workoutLog: { performedAt: "asc" } },
    });

    // Group by session date, take the max weight lifted that session
    const bySession = {};
    for (const entry of setEntries) {
      const dateKey = entry.workoutLog.performedAt.toISOString();
      if (!bySession[dateKey] || entry.weight > bySession[dateKey]) {
        bySession[dateKey] = entry.weight;
      }
    }

    const progression = Object.entries(bySession).map(([date, maxWeight]) => ({
      date,
      maxWeight,
    }));

    res.status(200).json(progression);
  } catch (err) {
    next(err);
  }
});

// GET /stats/summary — quick dashboard numbers
router.get("/summary", async (req, res, next) => {
  try {
    const [workoutCount, logCount, recentLogs] = await Promise.all([
      prisma.workout.count({ where: { userId: req.user.id } }),
      prisma.workoutLog.count({ where: { userId: req.user.id } }),
      prisma.workoutLog.findMany({
        where: { userId: req.user.id },
        orderBy: { performedAt: "desc" },
        take: 1,
      }),
    ]);

    res.status(200).json({
      workoutCount,
      totalSessionsLogged: logCount,
      lastSessionDate: recentLogs[0]?.performedAt || null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;