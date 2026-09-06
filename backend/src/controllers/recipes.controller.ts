import { Request, Response } from "express";
import {
  recipeIngredientsQuerySchema,
  recipeByIngredientsResultSchema,
  recipeIdParamsSchema,
  recipeInstructionsSchema,
} from "../schemas/recipes.schema";
import { favoriteRecipesSchema } from "../schemas/favorites.schema";
import {
  findRecipesByIngredients,
  findRecipeInstructionsById,
} from "../services/recipes.service";
import { getFavoriteRecipes } from "../services/favorites.service";
import {
  mapRecipeInstructions,
  mapRecipesWithFavorites,
} from "../mappers/recipes.mapper";
import { apiMessages } from "../constants/apiMessages";

export const searchRecipes = async (req: Request, res: Response) => {
  const parsedIngredientsQueryResult = recipeIngredientsQuerySchema.safeParse(
    req.query,
  );

  if (!parsedIngredientsQueryResult.success) {
    return res.status(400).json({
      error: parsedIngredientsQueryResult.error.issues.map(
        (issue) => issue.message,
      ),
    });
  }

  try {
    const recipes = await findRecipesByIngredients(
      parsedIngredientsQueryResult.data.ingredients,
    );
    const parsedRecipesResult =
      recipeByIngredientsResultSchema.safeParse(recipes);

    if (!parsedRecipesResult.success) {
      console.error(
        `${apiMessages.spoonacular.invalidResponse}:`,
        parsedRecipesResult.error.issues,
      );
      return res.status(502).json({
        error: apiMessages.spoonacular.unableToRetrieveRecipes,
      });
    }

    let result = parsedRecipesResult.data;
    const userId = req.userId;

    if (userId) {
      const favoriteRecipes = await getFavoriteRecipes(userId);
      const parsedFavoriteRecipes =
        favoriteRecipesSchema.safeParse(favoriteRecipes);

      if (!parsedFavoriteRecipes.success) {
        console.error(
          `${apiMessages.favoriteRecipes.unableToRetrieve}:`,
          parsedFavoriteRecipes.error.issues,
        );
        return res.status(502).json({
          error: apiMessages.favoriteRecipes.unableToRetrieve,
        });
      }

      result = mapRecipesWithFavorites(
        parsedRecipesResult.data,
        parsedFavoriteRecipes.data,
      );
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: apiMessages.spoonacular.searchRecipesError,
    });
  }
};

export const findRecipeInstructions = async (req: Request, res: Response) => {
  const parsedRecipeIdResult = recipeIdParamsSchema.safeParse(
    req.params.recipeId,
  );
  if (!parsedRecipeIdResult.success) {
    console.log(
      parsedRecipeIdResult.error.issues.map((issue) => issue.message),
    );
    return res.status(400).json({
      error: apiMessages.spoonacular.invalidRecipeId,
    });
  }

  try {
    const recipeInstructions = await findRecipeInstructionsById(
      parsedRecipeIdResult.data,
    );

    const parsedRecipeInstructionsResult =
      recipeInstructionsSchema.safeParse(recipeInstructions);

    if (!parsedRecipeInstructionsResult.success) {
      console.error(
        `${apiMessages.spoonacular.invalidResponse}:`,
        parsedRecipeInstructionsResult.error.issues,
      );
      return res.status(400).json({
        error: apiMessages.spoonacular.unableToRetrieveRecipeInstructions,
      });
    }

    const mappedRecipeInstructions = mapRecipeInstructions(
      parsedRecipeInstructionsResult.data,
    );

    let result = mappedRecipeInstructions;
    const userId = req.userId;

    if (userId) {
      const favoriteRecipes = await getFavoriteRecipes(userId);
      const parsedFavoriteRecipes =
        favoriteRecipesSchema.safeParse(favoriteRecipes);

      if (!parsedFavoriteRecipes.success) {
        console.error(
          `${apiMessages.favoriteRecipes.unableToRetrieve}:`,
          parsedFavoriteRecipes.error.issues,
        );
        return res.status(502).json({
          error: apiMessages.favoriteRecipes.unableToRetrieve,
        });
      }

      const isFavorite = parsedFavoriteRecipes.data.some(
        (favoriteRecipe) =>
          favoriteRecipe.recipeId === parsedRecipeIdResult.data,
      );

      result = mappedRecipeInstructions.map((recipe) => ({
        ...recipe,
        isFavorite,
      }));
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: apiMessages.spoonacular.recipeInstructionsError,
    });
  }
};
