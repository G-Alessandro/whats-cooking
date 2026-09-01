import { describe, expect, it } from "vitest";
import {
  loginSchema,
  registerSchema,
} from "../../src/schemas/authentication.schemas";

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "1234567",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      email: "invalid-email",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "1234567",
      confirmPassword: "1234567",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a confirm password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "1234567",
    });

    expect(result.success).toBe(false);
  });

  it("rejects passwords that do not match", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "different123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty email", () => {
    const result = registerSchema.safeParse({
      email: "",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "",
      confirmPassword: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty confirm password", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "",
    });

    expect(result.success).toBe(false);
  });
});
