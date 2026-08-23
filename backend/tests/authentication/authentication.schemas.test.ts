import { describe, it, expect } from "vitest";
import {
  userSchema,
  refreshTokenSchema,
} from "../../src/schemas/authentication.schema";

describe("userSchema", () => {
  it("accepts valid data", () => {
    const result = userSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = userSchema.safeParse({
      email: "invalid-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = userSchema.safeParse({
      email: "test@example.com",
      password: "1234567",
    });
-
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = userSchema.safeParse({
      email: "test@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = userSchema.safeParse({
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing password", () => {
    const result = userSchema.safeParse({
      email: "test@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty object", () => {
    const result = userSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("refreshTokenSchema", () => {
  it("accepts valid refresh token", () => {
    const result = refreshTokenSchema.safeParse({
      refreshToken: "valid-refresh-token",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty refresh token", () => {
    const result = refreshTokenSchema.safeParse({
      refreshToken: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing refresh token", () => {
    const result = refreshTokenSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects non-string refresh token", () => {
    const result = refreshTokenSchema.safeParse({
      refreshToken: 12345,
    });
    expect(result.success).toBe(false);
  });
});
