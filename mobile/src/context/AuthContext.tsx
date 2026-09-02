import { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  getRefreshToken,
  deleteRefreshToken,
} from "../services/token.services";
import {
  logoutUser,
  refreshAccessToken,
} from "../services/authentication.services";
import { router } from "expo-router";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = accessToken !== null;

  async function restoreSession() {
    try {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        return;
      }

      const newAccessToken = await refreshAccessToken(refreshToken);

      setAccessToken(newAccessToken);
    } catch (error) {
      console.error("Unable to restore session:", error);

      await deleteRefreshToken();
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    const refreshToken = await getRefreshToken();

    try {
      if (refreshToken) {
        const data = await logoutUser(refreshToken);

        Alert.alert(data.message, "You will be redirected to the Home page.", [
          {
            text: "OK",
            onPress: () => router.replace("/"),
          },
        ]);
      }
    } catch (error) {
      console.error("Unable to logout from server:", error);
    } finally {
      await deleteRefreshToken();
      setAccessToken(null);
    }
  }

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        isLoading,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
