import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import {
  Recipe,
  RecipeInstructions,
  CollapsibleSectionProps,
} from "../types/recipes.types";
import { getRecipeInstructions } from "../services/recipes.services";
import { getValidAccessToken } from "../services/token.services";
import FavoriteButton from "./FavoriteButton";
import { useAuth } from "../context/AuthContext";
import { useRecipes } from "../context/RecipeContext";
import { router } from "expo-router";
import LoadingIcon from "./LoadingIcon";

type RecipeCardProps = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [showUsedIngredients, setShowUsedIngredients] = useState(false);
  const [showMissedIngredients, setShowMissedIngredients] = useState(false);
  const { accessToken, setAccessToken } = useAuth();
  const { setRecipeInstructions } = useRecipes();
  const [loading, setLoading] = useState(false);

  function CollapsibleSection({
    ingredientsType,
    ingredientsCount,
    isOpen,
    onToggle,
    ingredientsArray,
  }: CollapsibleSectionProps) {
    if (ingredientsArray.length === 0) {
      return null;
    }

    return (
      <View style={styles.collapsible}>
        <View>
          <TouchableOpacity onPress={onToggle} style={styles.collapsibleButton}>
            <Text style={styles.collapsibleName}>
              {ingredientsType}: {ingredientsCount}
            </Text>
            <Text style={styles.collapsibleTriangle}>{isOpen ? "▲" : "▼"}</Text>
          </TouchableOpacity>
        </View>
        {isOpen && (
          <View style={styles.ingredientsContainer}>
            {ingredientsArray.map((ingredient) => (
              <Text key={ingredient.id} style={styles.ingredient}>
                {ingredient.name}: {ingredient.amount} {ingredient.unit}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }

  async function findRecipeInstructions(
    recipeId: number,
    recipeName: string,
    recipeImage: string,
  ) {
    try {
      setLoading(true);
      const validAccessToken = accessToken
        ? await getValidAccessToken(accessToken)
        : undefined;
      if (validAccessToken) {
        setAccessToken(validAccessToken);
      }
      const recipesInstructions = await getRecipeInstructions(
        recipeId,
        validAccessToken,
      );
      const enrichedRecipeInstructions = recipesInstructions.map(
        (recipeInstructions: RecipeInstructions) => ({
          ...recipeInstructions,
          id: recipeId,
          title: recipeName,
          image: recipeImage,
        }),
      );

      setRecipeInstructions(enrichedRecipeInstructions);

      router.push("/recipes/instructions");
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
    <View style={styles.container}>
      <Text style={styles.name}>{recipe.title}</Text>

      <View style={styles.recipeContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <View>
          {(recipe.usedIngredientCount !== undefined ||
            recipe.missedIngredientCount !== undefined) && (
            <Text style={styles.ingredientsCollapsibleTitle}>ingredients</Text>
          )}
          <View style={styles.collapsibleContainer}>
            <CollapsibleSection
              ingredientsType="Used"
              ingredientsCount={recipe.usedIngredientCount ?? 0}
              isOpen={showUsedIngredients}
              onToggle={() => setShowUsedIngredients(!showUsedIngredients)}
              ingredientsArray={recipe.usedIngredients ?? []}
            />
            <CollapsibleSection
              ingredientsType="Missed"
              ingredientsCount={recipe.missedIngredientCount ?? 0}
              isOpen={showMissedIngredients}
              onToggle={() => setShowMissedIngredients(!showMissedIngredients)}
              ingredientsArray={recipe.missedIngredients ?? []}
            />
          </View>
        </View>

        <View style={[styles.buttonContainer, loading && styles.loading]}>
          <FavoriteButton
            recipeName={recipe.title}
            recipeImage={recipe.image}
            recipeId={recipe.id}
            isFavorite={recipe.isFavorite}
          />
          {!loading && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                findRecipeInstructions(recipe.id, recipe.title, recipe.image)
              }
            >
              <Text style={styles.buttonText}>Recipe</Text>
            </TouchableOpacity>
          )}
          {loading && <LoadingIcon width={30} height={30} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderColor: "green",
    borderWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },

  image: {
    width: 100,
    height: 100,
  },

  recipeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    width: "100%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 2,
    borderBottomColor: "green",
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 5,
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  loading: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  button: {
    height: 30,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#059415",
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  ingredientsCollapsibleTitle: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 10,
  },

  collapsibleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 5,
    gap: 8,
  },

  collapsible: {
    position: "relative",
  },

  collapsibleButton: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 4,
    gap: 2,
    borderWidth: 1,
    borderColor: "green",
  },

  collapsibleName: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  collapsibleTriangle: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    borderRadius: 50,
  },

  ingredientsContainer: {
    zIndex: 1,
    display: "flex",
    position: "absolute",
    top: 25,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "green",
    borderBottomWidth: 0,
  },

  ingredient: {
    fontSize: 12,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderColor: "green",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
});
