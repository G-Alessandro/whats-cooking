import { StyleSheet, ScrollView, View, Text, Alert } from "react-native";
import { Recipe, FavoriteRecipe } from "../types/recipes.types";
import { getValidAccessToken } from "../services/token.services";
import { getFavoriteRecipes } from "../services/favorites.services";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingIcon from "./LoadingIcon";
import RecipeCard from "./RecipeCard";

export default function FavoriteRecipes() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken, setAccessToken } = useAuth();

  async function findFavoriteRecipes() {
    try {
      setLoading(true);

      if (!accessToken) {
        throw new Error("You must be logged in to view your favorite recipes.");
      }

      const validAccessToken = await getValidAccessToken(accessToken);

      setAccessToken(validAccessToken);

      const favoriteRecipes = await getFavoriteRecipes(validAccessToken);

      const formattedFavoriteRecipes: Recipe[] = favoriteRecipes.map(
        (favoriteRecipe: FavoriteRecipe) => ({
          id: favoriteRecipe.recipeId,
          title: favoriteRecipe.recipeName,
          image: favoriteRecipe.recipeImage,
          isFavorite: true,
        }),
      );

      setFavoriteRecipes(formattedFavoriteRecipes);
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

  useFocusEffect(
    useCallback(() => {
      findFavoriteRecipes();
    }, [accessToken]),
  );

  return (
    <View>
      <Text style={styles.title}>Recipes</Text>
      <View style={styles.container}>
        {!loading && favoriteRecipes.length > 0 && (
          <ScrollView style={styles.listContainer}>
            {favoriteRecipes.map((recipe) => {
              return <RecipeCard key={recipe.id} recipe={recipe} />;
            })}
          </ScrollView>
        )}
        {!loading && favoriteRecipes.length === 0 && (
          <Text style={styles.noFavoriteText}>
            You don't have any favorite recipes yet.
          </Text>
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

  listContainer: { marginTop: 10, marginBottom: 120 },

  noFavoriteText: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
