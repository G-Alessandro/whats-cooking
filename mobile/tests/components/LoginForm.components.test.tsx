import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import LoginForm from "../../src/components/LoginForm";
import { loginUser } from "../../src/services/authentication.services";
import { saveRefreshToken } from "../../src/services/token.services";
import { Alert } from "react-native";

vi.mock("../../src/services/authentication.service", () => ({
  loginUser: vi.fn(),
}));

vi.mock("../../src/services/token.services", () => ({
  saveRefreshToken: vi.fn(),
}));

const setAccessToken = vi.fn();

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: () => ({
    setAccessToken,
  }),
}));

vi.mock("expo-router", () => ({
  router: {
    replace: vi.fn(),
  },
}));

describe("LoginFormScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the login form", async () => {
    const { getByText, getByPlaceholderText } = await render(<LoginForm />);

    expect(getByText("Welcome Back")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });

  it("shows an error for an invalid email", async () => {
    const { getByText, getByPlaceholderText } = await render(<LoginForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Email"), "invalid-email");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    });

    await act(async () => {
      fireEvent.press(getByText("Login"));
    });

    await waitFor(() => {
      expect(getByText("Invalid email")).toBeTruthy();
    });

    expect(loginUser).not.toHaveBeenCalled();
  });

  it("shows an error when the password is too short", async () => {
    const { getByText, getByPlaceholderText } = await render(<LoginForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Password"), "1234567");
    });

    await act(async () => {
      fireEvent.press(getByText("Login"));
    });

    await waitFor(() => {
      expect(
        getByText("Password must have at least 8 characters"),
      ).toBeTruthy();
    });

    expect(loginUser).not.toHaveBeenCalled();
  });

  it("does not call loginUser when the form is empty", async () => {
    const { getByText } = await render(<LoginForm />);

    await act(async () => {
      fireEvent.press(getByText("Login"));
    });

    await waitFor(() => {
      expect(loginUser).not.toHaveBeenCalled();
    });
  });

  it("calls loginUser with valid credentials", async () => {
    vi.mocked(loginUser).mockResolvedValue({
      accessToken: "access-token-123",
      refreshToken: "refresh-token-123",
    });

    vi.mocked(saveRefreshToken).mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = await render(<LoginForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    });

    await act(async () => {
      fireEvent.press(getByText("Login"));
    });

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("sets the access token after a successful login", async () => {
    vi.mocked(loginUser).mockResolvedValue({
      accessToken: "access-token-123",
      refreshToken: "refresh-token-123",
    });

    vi.mocked(saveRefreshToken).mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = await render(<LoginForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    });

    await act(async () => {
      fireEvent.press(getByText("Login"));
    });

    await waitFor(() => {
      expect(setAccessToken).toHaveBeenCalledWith("access-token-123");
    });
  });

  it("saves the refresh token after a successful login", async () => {
    vi.mocked(loginUser).mockResolvedValue({
      accessToken: "access-token-123",
      refreshToken: "refresh-token-123",
    });

    vi.mocked(saveRefreshToken).mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = await render(<LoginForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    });

    await act(async () => {
      fireEvent.press(getByText("Login"));
    });

    await waitFor(() => {
      expect(saveRefreshToken).toHaveBeenCalledWith("refresh-token-123");
    });
  });

  it("does not call loginUser when the email is invalid", async () => {
    const { getByText, getByPlaceholderText } = await render(<LoginForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Email"), "not-an-email");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    });

    await act(async () => {
      fireEvent.press(getByText("Login"));
    });

    await waitFor(() => {
      expect(getByText("Invalid email")).toBeTruthy();
    });

    expect(loginUser).not.toHaveBeenCalled();
    expect(setAccessToken).not.toHaveBeenCalled();
    expect(saveRefreshToken).not.toHaveBeenCalled();
  });

  it("shows an alert when loginUser fails", async () => {
    const alertSpy = vi.spyOn(Alert, "alert").mockImplementation(() => {});

    vi.mocked(loginUser).mockRejectedValue(new Error("Invalid credentials"));

    const { getByText, getByPlaceholderText } = await render(<LoginForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    });

    await act(async () => {
      fireEvent.press(getByText("Login"));
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Login failed",
        "Invalid credentials",
      );
    });

    alertSpy.mockRestore();
  });
});
