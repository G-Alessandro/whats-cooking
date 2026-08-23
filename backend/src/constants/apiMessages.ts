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
  authentication: {
    registration: {
      unableToRegister: "Unable to register user",
      invalidData: "Please use a valid email or password",
      emailAlreadyUsed: "Email already in use",
    },
    login: {
      loginFailed: "Login failed",
      invalidCredentials: "Invalid credentials",
      invalidData: "invalid email or password",
      loggedIn: "Login successful",
    },
    logout: {
      invalidCredentials: "Invalid credentials",
      failedLogout: "Logout failed",
      logoutSuccessful: "Logout successful",
    },
    refreshToken: {
      invalid: "Invalid refresh token",
      invalidOrExpired: "Invalid or expired refresh token",
      unableToRefresh: "Unable to refresh access token",
    },
    middleware: {
      required: "Authentication required",
      invalid: "Invalid authorization",
    },
  },
} as const;
