import {
  RecipeInstructions,
  RecipesListResult,
} from "../schemas/recipes.schema";
import { FavoriteRecipes } from "../schemas/favorites.schema";

export function mapRecipeInstructions(recipeInstructions: RecipeInstructions) {
  let mappedRecipeInstructions = [];

  for (const recipe of recipeInstructions) {
    const recipeTotalEquipment = new Set<string>();
    const recipeTotalIngredients = new Set<string>();
    for (const step of recipe.steps) {
      for (const equipment of step.equipment) {
        recipeTotalEquipment.add(equipment.name);
      }

      for (const ingredient of step.ingredients) {
        recipeTotalIngredients.add(ingredient.name);
      }
    }
    mappedRecipeInstructions.push({
      ...recipe,
      totalEquipment: [...recipeTotalEquipment],
      totalIngredients: [...recipeTotalIngredients],
    });
  }

  return mappedRecipeInstructions;
}

export function mapRecipesWithFavorites(
  recipes: RecipesListResult,
  favoriteRecipes: FavoriteRecipes,
) {
  const favoriteRecipeIds = new Set(
    favoriteRecipes.map((favorite) => favorite.recipeId),
  );

  return recipes.map((recipe) => ({
    ...recipe,
    isFavorite: favoriteRecipeIds.has(recipe.id),
  }));
}
