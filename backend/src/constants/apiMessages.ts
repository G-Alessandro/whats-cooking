export const apiMessages = {
  spoonacular: {
    unableToRetrieveRecipes: "Unable to retrieve recipes",
    unableToRetrieveRecipeInstructions:
      "Error while searching for recipe instructions",
    invalidResponse: "Invalid response received from Spoonacular",
    searchRecipesError: "Error while searching for recipes",
    recipeInstructionsError: "Error while retrieving recipe instructions",
    requestFailed: "Spoonacular request failed",
    apiKeyNotConfigured: "Spoonacular API key not configured",
    invalidRecipeId: "The recipe could not be found",
  },
} as const;
