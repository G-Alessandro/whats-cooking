import prisma from "../clients/prisma.client";

export async function getFavoriteRecipes(userId: number) {
  return await prisma.favoriteRecipe.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      recipeId: true,
      userId: true,
    },
  });
}

export async function addFavoriteRecipe(recipeId: number, userId: number) {
  const favoriteRecipe = await prisma.favoriteRecipe.create({
    data: {
      recipeId,
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
