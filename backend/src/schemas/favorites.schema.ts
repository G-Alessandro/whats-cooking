import { z } from "zod";

export const favoriteRecipeIdParamSchema = z.coerce.number().int().positive();

export const newFavoriteRecipeSchema = z.object({
  recipeName: z.string(),
  recipeImage: z.string(),
  recipeId: z.number(),
});

export type NewFavoriteRecipe = z.infer<typeof newFavoriteRecipeSchema>;
