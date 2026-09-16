import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRecipes } from "../context/RecipeContext";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const { setRecipesList, setRecipeInstructions } = useRecipes();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    setRecipesList([]);
    setRecipeInstructions([]);
  }

  return (
    <View>
      <Text style={styles.title}>Logout</Text>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
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
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
