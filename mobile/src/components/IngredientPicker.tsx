import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { getRecipesByIngredients } from "../services/recipes.services";
import { getValidAccessToken } from "../services/token.services";
import { useRecipes } from "../context/RecipeContext";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import LoadingIcon from "./LoadingIcon";

export default function HomeHeader() {
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken, setAccessToken } = useAuth();
  const { setRecipesList } = useRecipes();

  function addIngredient() {
    if (!ingredient.trim()) return;
    setIngredients((prev) => [...prev, ingredient.trim()]);
    setIngredient("");
  }

  function removeIngredient(indexToRemove: number) {
    setIngredients((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  }

  function clearIngredients() {
    setIngredients([]);
  }

  async function findRecipes() {
    try {
      setLoading(true);
      const validAccessToken = accessToken
        ? await getValidAccessToken(accessToken)
        : undefined;

      if (validAccessToken) {
        setAccessToken(validAccessToken);
      }

      const recipes = await getRecipesByIngredients(
        ingredients,
        validAccessToken,
      );

      setRecipesList(recipes);

      router.push("/recipes/list");
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Search failed",
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <Text style={styles.title}>Find Recipes</Text>

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={ingredient}
            onChangeText={setIngredient}
            placeholder="Enter an ingredient"
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity style={styles.inputButton} onPress={addIngredient}>
            <Text style={styles.buttonText}>ADD</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.ScrollIngredientsContainer}>
          <View style={styles.ingredientsContainer}>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredient}>
                <Text style={styles.ingredientName}>{ingredient}</Text>

                <TouchableOpacity
                  style={styles.ingredientButton}
                  onPress={() => removeIngredient(index)}
                >
                  <Text style={styles.ingredientButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={[styles.buttonContainer, loading && styles.loading]}>
            {!loading && (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={clearIngredients}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    ingredients.length === 0 && styles.buttonDisabled,
                  ]}
                  onPress={findRecipes}
                  disabled={ingredients.length === 0}
                >
                  <Text style={styles.buttonText}>Find Recipes</Text>
                </TouchableOpacity>
              </>
            )}
            {loading && <LoadingIcon width={52} height={52} />}
          </View>
        </ScrollView>
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

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  input: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },

  inputButton: {
    width: 52,
    height: 52,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b95be",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 70,
  },

  loading: {
    marginTop: 20,
    justifyContent: "center",
  },

  button: {
    height: 52,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#059415",
    paddingHorizontal: 20,
    marginTop: 20,
  },

  cancelButton: {
    backgroundColor: "#9c9c9c",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  ScrollIngredientsContainer: { marginBottom: 340 },

  ingredientsContainer: {
    width: "100%",
    minHeight: 200,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#24ac36",
    gap: 15,
    marginTop: 20,
    backgroundColor: "#ffffff",
  },

  ingredient: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#46eb5c49",
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 20,
  },

  ingredientName: { fontSize: 18, fontWeight: "bold" },

  ingredientButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    marginLeft: 8,
  },

  ingredientButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },

  buttonDisabled: {
    backgroundColor: "#9c9c9c",
  },
});
