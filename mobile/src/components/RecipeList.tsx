import { StyleSheet, ScrollView, View, Text } from "react-native";
import RecipeCard from "./RecipeCard";
import { useRecipes } from "../context/RecipeContext";

export default function RecipeList() {
  const { recipesList } = useRecipes();

  return (
    <View>
      <Text style={styles.title}>Recipes</Text>
      <View style={styles.container}>
        {recipesList.length > 0 && (
          <ScrollView style={styles.listContainer}>
            {recipesList.map((recipe) => {
              return <RecipeCard key={recipe.id} recipe={recipe} />;
            })}
          </ScrollView>
        )}
        {recipesList.length <= 0 && (
          <Text style={styles.noRecipesText}>No recipes found</Text>
        )}
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

  listContainer: { marginBottom: 280 },

  noRecipesText: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
