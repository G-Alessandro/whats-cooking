import { spoonacularFetch } from "../clients/spoonacular.client";

export const findRecipesByIngredients = async (ingredients: string[]) => {
  return spoonacularFetch("/recipes/findByIngredients", {
    ingredients: ingredients.join(","),
    number: "10",
    ranking: "1",
    ignorePantry: "true",
  });
};

export const findRecipeInstructionsById = async (recipeId: number) => {
  return spoonacularFetch(`/recipes/${recipeId}/analyzedInstructions`, {});
};
