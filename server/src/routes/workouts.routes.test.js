import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../lib/prisma.js";

describe("Workout routes", () => {
  const testEmail = `workout-test-${Date.now()}@example.com`;
  let token;
  let workoutId;

  beforeAll(async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: testEmail, name: "Workout Tester", password: "supersecure123" });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: testEmail, password: "supersecure123" });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    if (user) {
      await prisma.exercise.deleteMany({ where: { workout: { userId: user.id } } });
      await prisma.workout.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
    await prisma.$disconnect();
  });

  it("rejects requests without a token", async () => {
    const res = await request(app).get("/workouts");
    expect(res.status).toBe(401);
  });

  it("creates a workout with nested exercises", async () => {
    const res = await request(app)
      .post("/workouts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Workout",
        exercises: [{ name: "Test Exercise", order: 1 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.exercises).toHaveLength(1);
    workoutId = res.body.id;
  });

  it("fetches the created workout by id", async () => {
    const res = await request(app)
      .get(`/workouts/${workoutId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Test Workout");
  });

  it("deletes the workout", async () => {
    const res = await request(app)
      .delete(`/workouts/${workoutId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});