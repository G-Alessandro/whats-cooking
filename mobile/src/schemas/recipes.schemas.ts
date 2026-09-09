import { z } from "zod";

const recipeIngredientSchema = z.object({
  id: z.number(),
  image: z.string(),
  name: z.string(),
  amount: z.number(),
  unit: z.string(),
});

export const recipeListResultSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    image: z.string(),
    usedIngredientCount: z.number().optional(),
    usedIngredients: z.array(recipeIngredientSchema).optional(),
    missedIngredientCount: z.number().optional(),
    missedIngredients: z.array(recipeIngredientSchema).optional(),
    isFavorite: z.boolean().optional(),
  }),
);

export type RecipesListResult = z.infer<typeof recipeListResultSchema>;
