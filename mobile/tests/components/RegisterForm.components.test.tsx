import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RegisterForm from "../../src/components/RegisterForm";
import { registerUser } from "../../src/services/authentication.services";

vi.mock("../../src/services/authentication.service", () => ({
  registerUser: vi.fn(),
}));

vi.mock("expo-router", () => ({
  useFocusEffect: vi.fn(),
  router: {
    replace: vi.fn(),
  },
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the registration form", async () => {
    const { getByText, getByPlaceholderText } = await render(<RegisterForm />);

    expect(getByText("Create your account")).toBeTruthy();

    expect(getByPlaceholderText("Email")).toBeTruthy();

    expect(getByPlaceholderText("Password")).toBeTruthy();

    expect(getByPlaceholderText("Confirm password")).toBeTruthy();

    expect(getByText("Register")).toBeTruthy();
  });

  it("shows an error for an invalid email", async () => {
    const { getByText, getByPlaceholderText } = await render(<RegisterForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Email"), "invalid-email");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    });

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Confirm password"),
        "password123",
      );
    });

    await act(async () => {
      fireEvent.press(getByText("Register"));
    });

    await waitFor(() => {
      expect(getByText("Invalid email")).toBeTruthy();
    });

    expect(registerUser).not.toHaveBeenCalled();
  });

  it("shows an error when the password is too short", async () => {
    const { getByPlaceholderText, getByText } = await render(<RegisterForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Password"), "1234567");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Confirm password"), "1234567");
    });

    await act(async () => {
      fireEvent.press(getByText("Register"));
    });

    await waitFor(() => {
      expect(
        getByText("Password must have at least 8 characters"),
      ).toBeTruthy();
    });

    expect(registerUser).not.toHaveBeenCalled();
  });

  it("shows an error when passwords do not match", async () => {
    const { getByPlaceholderText, getByText } = await render(<RegisterForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    });

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Confirm password"),
        "different123",
      );
    });

    await act(async () => {
      fireEvent.press(getByText("Register"));
    });

    await waitFor(() => {
      expect(getByText("Passwords must match")).toBeTruthy();
    });

    expect(registerUser).not.toHaveBeenCalled();
  });

  it("calls registerUser with valid data", async () => {
    vi.mocked(registerUser).mockResolvedValue({
      id: "123",
      email: "test@example.com",
    });

    const { getByPlaceholderText, getByText } = await render(<RegisterForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    });

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    });

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Confirm password"),
        "password123",
      );
    });

    await act(async () => {
      fireEvent.press(getByText("Register"));
    });

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
    });
  });

  it("does not call registerUser when the data is invalid", async () => {
    const { getByText } = await render(<RegisterForm />);

    await act(async () => {
      fireEvent.press(getByText("Register"));
    });

    expect(registerUser).not.toHaveBeenCalled();
  });
});
