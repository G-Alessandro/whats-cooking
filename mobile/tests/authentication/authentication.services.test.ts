import { beforeEach, describe, expect, it, vi } from "vitest";

const API_BACKEND_URL = vi.hoisted(() => {
  process.env.EXPO_PUBLIC_API_BACKEND_URL = "http://localhost:3000";
  return "http://localhost:3000";
});

import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../../src/services/authentication.service";

describe("authentication.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    process.env.EXPO_PUBLIC_API_BACKEND_URL = API_BACKEND_URL;

    vi.stubGlobal("fetch", vi.fn());
  });

  describe("registerUser", () => {
    it("registers a user successfully", async () => {
      const responseData = {
        accessToken: "access-token-123",
        refreshToken: "refresh-token-123",
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(responseData),
      } as unknown as Response);

      const result = await registerUser("test@example.com", "password123");

      expect(fetch).toHaveBeenCalledWith(
        `${API_BACKEND_URL}/authentication/registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        },
      );

      expect(result).toEqual(responseData);
    });

    it("throws the backend error when registration fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Email already exists",
        }),
      } as unknown as Response);

      await expect(
        registerUser("test@example.com", "password123"),
      ).rejects.toThrow("Email already exists");
    });

    it("throws the default error when registration fails without an error message", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Response);

      await expect(
        registerUser("test@example.com", "password123"),
      ).rejects.toThrow("Registration failed");
    });
  });

  describe("loginUser", () => {
    it("logs in a user successfully", async () => {
      const responseData = {
        accessToken: "access-token-123",
        refreshToken: "refresh-token-123",
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(responseData),
      } as unknown as Response);

      const result = await loginUser("test@example.com", "password123");

      expect(fetch).toHaveBeenCalledWith(
        `${API_BACKEND_URL}/authentication/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        },
      );

      expect(result).toEqual(responseData);
    });

    it("throws the backend error when login fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Invalid credentials",
        }),
      } as unknown as Response);

      await expect(
        loginUser("test@example.com", "wrong-password"),
      ).rejects.toThrow("Invalid credentials");
    });

    it("throws the default error when login fails without an error message", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Response);

      await expect(
        loginUser("test@example.com", "wrong-password"),
      ).rejects.toThrow("Login failed");
    });
  });

  describe("refreshAccessToken", () => {
    it("returns the new access token successfully", async () => {
      const responseData = {
        accessToken: "new-access-token",
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(responseData),
      } as unknown as Response);

      const result = await refreshAccessToken("refresh-token-123");

      expect(fetch).toHaveBeenCalledWith(
        `${API_BACKEND_URL}/authentication/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: "refresh-token-123",
          }),
        },
      );

      expect(result).toBe("new-access-token");
    });

    it("throws the backend error when refreshing the access token fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Refresh token expired",
        }),
      } as unknown as Response);

      await expect(refreshAccessToken("expired-refresh-token")).rejects.toThrow(
        "Refresh token expired",
      );
    });

    it("throws the default error when refreshing fails without an error message", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Response);

      await expect(refreshAccessToken("invalid-refresh-token")).rejects.toThrow(
        "Unable to refresh session",
      );
    });
  });

  describe("logoutUser", () => {
    it("logs out a user successfully", async () => {
      const responseData = {
        message: "Logged out successfully",
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(responseData),
      } as unknown as Response);

      const result = await logoutUser("refresh-token-123");

      expect(fetch).toHaveBeenCalledWith(
        `${API_BACKEND_URL}/authentication/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: "refresh-token-123",
          }),
        },
      );

      expect(result).toEqual(responseData);
    });

    it("throws the backend error when logout fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Invalid refresh token",
        }),
      } as unknown as Response);

      await expect(logoutUser("invalid-refresh-token")).rejects.toThrow(
        "Invalid refresh token",
      );
    });

    it("throws the default error when logout fails without an error message", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Response);

      await expect(logoutUser("invalid-refresh-token")).rejects.toThrow(
        "Unable to logout",
      );
    });
  });
});
