import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { RecipeProvider } from "../context/RecipeContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </RecipeProvider>
    </AuthProvider>
  );
}
