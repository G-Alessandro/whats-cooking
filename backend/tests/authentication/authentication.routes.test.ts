import { describe, it, expect } from "vitest";
import bcrypt from "bcrypt";
import prisma from "../../src/clients/prisma.client";
import request from "supertest";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../../src/utils/refresh-token";

import app from "../../src/app";

describe("POST /authentication/registration", () => {
  it("creates a new user", async () => {
    const response = await request(app)
      .post("/authentication/registration")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      message: "Registration successful",
    });
  });

  it("reject invalid email", async () => {
    const response = await request(app)
      .post("/authentication/registration")
      .send({
        email: "test",
        password: "password123",
      });

    expect(response.status).toBe(400);
  });

  it("reject invalid password", async () => {
    const response = await request(app)
      .post("/authentication/registration")
      .send({
        email: "test@gmail.com",
        password: "pass",
      });

    expect(response.status).toBe(400);
  });

  it("rejects an already used email", async () => {
    await request(app).post("/authentication/registration").send({
      email: "existing@example.com",
      password: "password",
    });

    const response = await request(app)
      .post("/authentication/registration")
      .send({
        email: "existing@example.com",
        password: "password",
      });

    expect(response.status).toBe(500);
  });
});

describe("POST /authentication/login", () => {
  it("with correct credentials", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
      },
    });

    const response = await request(app).post("/authentication/login").send({
      email: "test@example.com",
      password,
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      message: "Login successful",
    });
  });

  it("with non-existent email", async () => {
    const response = await request(app).post("/authentication/login").send({
      email: "not-exist@example.com",
      password: "password123",
    });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: expect.any(String),
    });
  });

  it("with incorrect password", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
      },
    });

    const response = await request(app).post("/authentication/login").send({
      email: "test@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: expect.any(String),
    });
  });

  it("with invalid body", async () => {
    const response = await request(app).post("/authentication/login").send({
      email: "not-an-email",
      password: "123",
    });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: expect.any(String),
    });
  });
});

describe("POST /authentication/refresh", () => {
  it("with valid refresh token", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "hashed-password",
      },
    });

    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashRefreshToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    });

    const response = await request(app).post("/authentication/refresh").send({
      refreshToken,
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("with non-existent refresh token", async () => {
    const refreshToken = generateRefreshToken();

    const response = await request(app).post("/authentication/refresh").send({
      refreshToken,
    });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: expect.any(String),
    });
  });

  it("with expired refresh token", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "hashed-password",
      },
    });

    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashRefreshToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    const response = await request(app).post("/authentication/refresh").send({
      refreshToken,
    });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: expect.any(String),
    });

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        tokenHash: hashRefreshToken(refreshToken),
      },
    });

    expect(storedToken).toBeNull();
  });

  it("with invalid body", async () => {
    const response = await request(app).post("/authentication/refresh").send({
      refreshToken: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: expect.any(String),
    });
  });
});

describe("POST /authentication/logout", () => {
  it("with valid refresh token", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "hashed-password",
      },
    });

    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashRefreshToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    });

    const response = await request(app).post("/authentication/logout").send({
      refreshToken,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logout successful" });

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        tokenHash: hashRefreshToken(refreshToken),
      },
    });

    expect(storedToken).toBeNull();
  });

  it("with non-existent refresh token", async () => {
    const refreshToken = generateRefreshToken();

    const response = await request(app).post("/authentication/logout").send({
      refreshToken,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logout successful" });
  });

  it("with invalid body", async () => {
    const response = await request(app).post("/authentication/logout").send({
      refreshToken: "",
    });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: expect.any(String),
    });
  });
});
