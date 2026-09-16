import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useState } from "react";
import LoadingIcon from "./LoadingIcon";
import { useRecipes } from "../context/RecipeContext";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const { setRecipesList, setRecipeInstructions } = useRecipes();
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  async function handleLogout() {
    setLoading(true);

    try {
      await logout();

      setRecipesList([]);
      setRecipeInstructions([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <Text style={styles.title}>Logout</Text>
      <View style={styles.container}>
        {!loading && (
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        )}
        {loading && <LoadingIcon width={52} height={52} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
    alignItems: "center",
    paddingTop: 20,
  },

  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    paddingBottom: 15,
    borderBottomColor: "green",
    borderBottomWidth: 2,
    marginTop: 50,
    marginBottom: 30,
  },

  button: {
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#059415",
    paddingHorizontal: 80,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
