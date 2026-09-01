import { fireEvent, render } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";
import LogoutButton from "../../src/components/LogoutButton";

const logoutMock = vi.fn();

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: () => ({
    logout: logoutMock,
  }),
}));

describe("LogoutButton", () => {
  it("renders the logout button", async () => {
    const { getByText } = await render(<LogoutButton />);

    expect(getByText("Logout")).toBeTruthy();
  });

  it("calls logout when pressed", async () => {
    const { getByText } = await render(<LogoutButton />);

    fireEvent.press(getByText("Logout"));

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
