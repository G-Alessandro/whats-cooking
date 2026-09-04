import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import {
  favoriteRecipeIdParamSchema,
  newFavoriteRecipeSchema,
} from "../schemas/favorites.schema";
import {
  getFavoriteRecipes,
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "../services/favorites.service";
import { apiMessages } from "../constants/apiMessages";

export async function getFavoriteRecipesController(
  req: Request,
  res: Response,
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        error: apiMessages.favoriteRecipes.authenticationRequired,
      });
    }

    const favoriteRecipes = await getFavoriteRecipes(userId);

    return res.status(200).json(favoriteRecipes);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: apiMessages.favoriteRecipes.unableToRetrieve,
    });
  }
}

export async function addFavoriteRecipeController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        error: apiMessages.favoriteRecipes.authenticationRequired,
      });
    }

    const parsedNewFavoriteRecipe = newFavoriteRecipeSchema.safeParse(req.body);

    if (!parsedNewFavoriteRecipe.success) {
      return res.status(400).json({
        error: apiMessages.favoriteRecipes.invalidId,
      });
    }

    const favoriteRecipe = await addFavoriteRecipe(
      parsedNewFavoriteRecipe.data,
      userId,
    );

    return res.status(201).json(favoriteRecipe);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        error: apiMessages.favoriteRecipes.unableToAdd,
      });
    }

    console.error(error);

    return res.status(500).json({
      error: apiMessages.favoriteRecipes.unableToAdd,
    });
  }
}

export async function removeFavoriteRecipeController(
  req: Request,
  res: Response,
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        error: apiMessages.favoriteRecipes.authenticationRequired,
      });
    }

    const parsedRecipeId = favoriteRecipeIdParamSchema.safeParse(
      req.params.recipeId,
    );

    if (!parsedRecipeId.success) {
      return res.status(400).json({
        error: apiMessages.favoriteRecipes.invalidId,
      });
    }

    await removeFavoriteRecipe(parsedRecipeId.data, userId);

    return res.status(204).send();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        error: apiMessages.favoriteRecipes.notFound,
      });
    }

    console.error(error);

    return res.status(500).json({
      error: apiMessages.favoriteRecipes.unableToRemove,
    });
  }
}
