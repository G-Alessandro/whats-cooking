import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "../../src/context/AuthContext";
import {
  getRefreshToken,
  deleteRefreshToken,
} from "../../src/services/token.services";
import {
  logoutUser,
  refreshAccessToken,
} from "../../src/services/authentication.service";
import { Button, Text } from "react-native";

vi.mock("../../src/services/token.services", () => ({
  getRefreshToken: vi.fn(),
  deleteRefreshToken: vi.fn(),
  saveRefreshToken: vi.fn(),
}));

vi.mock("../../src/services/authentication.service", () => ({
  logoutUser: vi.fn(),
  refreshAccessToken: vi.fn(),
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

function TestComponent() {
  const { accessToken, setAccessToken, isLoading, isAuthenticated, logout } =
    useAuth();

  return (
    <>
      <Text testID="accessToken">{accessToken ?? "null"}</Text>

      <Text testID="isLoading">{isLoading ? "true" : "false"}</Text>

      <Text testID="isAuthenticated">{isAuthenticated ? "true" : "false"}</Text>

      <Button
        testID="setAccessToken"
        title="Set Access Token"
        onPress={() => setAccessToken("manual-access-token")}
      />

      <Button testID="logout" title="Logout" onPress={() => logout()} />
    </>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getRefreshToken).mockResolvedValue(null);
    vi.mocked(deleteRefreshToken).mockResolvedValue(undefined);
    vi.mocked(refreshAccessToken).mockResolvedValue("new-access-token");
    vi.mocked(logoutUser).mockResolvedValue(undefined);
  });

  afterEach(async () => {
    await cleanup();
  });

  it("is not authenticated when there is no refresh token", async () => {
    vi.mocked(getRefreshToken).mockResolvedValue(null);

    const { getByTestId } = await render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("isLoading").props.children).toBe("false");
    });

    expect(getByTestId("accessToken").props.children).toBe("null");

    expect(getByTestId("isAuthenticated").props.children).toBe("false");

    expect(refreshAccessToken).not.toHaveBeenCalled();
  });

  it("restores the access token when the refresh token is valid", async () => {
    vi.mocked(getRefreshToken).mockResolvedValue("refresh-token-123");
    vi.mocked(refreshAccessToken).mockResolvedValue("new-access-token");

    const { getByTestId } = await render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("accessToken").props.children).toBe(
        "new-access-token",
      );
      expect(getByTestId("isAuthenticated").props.children).toBe("true");
      expect(getByTestId("isLoading").props.children).toBe("false");
    });

    expect(getRefreshToken).toHaveBeenCalled();
    expect(refreshAccessToken).toHaveBeenCalledWith("refresh-token-123");
  });

  it("deletes the refresh token when session restoration fails", async () => {
    vi.mocked(getRefreshToken).mockResolvedValue("expired-refresh-token");
    vi.mocked(refreshAccessToken).mockRejectedValue(
      new Error("Refresh token expired"),
    );

    const { getByTestId } = await render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(deleteRefreshToken).toHaveBeenCalled();
      expect(getByTestId("accessToken").props.children).toBe("null");
      expect(getByTestId("isAuthenticated").props.children).toBe("false");
      expect(getByTestId("isLoading").props.children).toBe("false");
    });
  });

  it("updates the access token with setAccessToken", async () => {
    vi.mocked(getRefreshToken).mockResolvedValue(null);

    const { getByTestId } = await render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("isLoading").props.children).toBe("false");
    });

    await fireEvent.press(getByTestId("setAccessToken"));

    expect(getByTestId("accessToken").props.children).toBe(
      "manual-access-token",
    );

    expect(getByTestId("isAuthenticated").props.children).toBe("true");
  });

  it("logs out successfully", async () => {
    vi.mocked(getRefreshToken).mockResolvedValue("refresh-token-123");

    const { getByTestId } = await render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("isLoading").props.children).toBe("false");
    });

    await act(async () => {
      fireEvent.press(getByTestId("logout"));
    });

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledWith("refresh-token-123");
      expect(deleteRefreshToken).toHaveBeenCalled();
      expect(getByTestId("accessToken").props.children).toBe("null");
      expect(getByTestId("isAuthenticated").props.children).toBe("false");
    });
  });

  it("does not call logoutUser when there is no refresh token", async () => {
    vi.mocked(getRefreshToken).mockResolvedValue(null);

    const { getByTestId } = await render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("isLoading").props.children).toBe("false");
    });

    await act(async () => {
      fireEvent.press(getByTestId("logout"));
    });

    expect(logoutUser).not.toHaveBeenCalled();

    expect(deleteRefreshToken).toHaveBeenCalled();

    expect(getByTestId("accessToken").props.children).toBe("null");

    expect(getByTestId("isAuthenticated").props.children).toBe("false");
  });

  it("deletes the refresh token when logout fails", async () => {
    vi.mocked(getRefreshToken).mockResolvedValue("refresh-token-123");

    vi.mocked(logoutUser).mockRejectedValue(new Error("Logout failed"));

    const { getByTestId } = await render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("isLoading").props.children).toBe("false");
    });

    await act(async () => {
      fireEvent.press(getByTestId("logout"));
    });

    expect(logoutUser).toHaveBeenCalledWith("refresh-token-123");

    expect(deleteRefreshToken).toHaveBeenCalled();

    expect(getByTestId("accessToken").props.children).toBe("null");

    expect(getByTestId("isAuthenticated").props.children).toBe("false");
  });

  it("throws an error when useAuth is used outside AuthProvider", async () => {
    function ComponentOutsideProvider() {
      useAuth();

      return null;
    }

    let caughtError: unknown;

    try {
      await act(async () => {
        await render(<ComponentOutsideProvider />);
      });
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeInstanceOf(Error);

    expect((caughtError as Error).message).toBe(
      "useAuth must be used inside AuthProvider",
    );
  });
});
