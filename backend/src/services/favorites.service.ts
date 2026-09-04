import prisma from "../clients/prisma.client";
import { NewFavoriteRecipe } from "../schemas/favorites.schema";

export async function getFavoriteRecipes(userId: number) {
  return await prisma.favoriteRecipe.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      recipeName: true,
      recipeImage: true,
      recipeId: true,
    },
  });
}

export async function addFavoriteRecipe(
  favoriteRecipeData: NewFavoriteRecipe,
  userId: number,
) {
  const favoriteRecipe = await prisma.favoriteRecipe.create({
    data: {
      recipeName: favoriteRecipeData.recipeName,
      recipeImage: favoriteRecipeData.recipeImage,
      recipeId: favoriteRecipeData.recipeId,
      userId,
    },
  });

  return favoriteRecipe;
}

export async function removeFavoriteRecipe(recipeId: number, userId: number) {
  await prisma.favoriteRecipe.delete({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });
}
