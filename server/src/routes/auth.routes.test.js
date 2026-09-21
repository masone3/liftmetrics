import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../lib/prisma.js";

describe("Auth routes", () => {
  const testEmail = `test-${Date.now()}@example.com`;

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it("registers a new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: testEmail, name: "Test User", password: "supersecure123" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(testEmail);
    expect(res.body.passwordHash).toBeUndefined();
  });

  it("rejects duplicate email", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: testEmail, name: "Test User", password: "supersecure123" });

    expect(res.status).toBe(409);
  });

  it("rejects weak password", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: `weak-${Date.now()}@example.com`, name: "Test", password: "short" });

    expect(res.status).toBe(400);
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: testEmail, password: "supersecure123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: testEmail, password: "wrongpassword" });

    expect(res.status).toBe(401);
  });
});