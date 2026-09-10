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

export const recipeInstructionsSchema = z.array(
  z.object({
    isFavorite: z.boolean().optional(),
    name: z.string(),
    steps: z.array(
      z.object({
        equipment: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            temperature: z
              .object({
                number: z.number(),
                unit: z.string(),
              })
              .optional(),
          }),
        ),
        ingredients: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          }),
        ),
        length: z
          .object({
            number: z.number(),
            unit: z.string(),
          })
          .optional(),
        number: z.number(),
        step: z.string(),
      }),
    ),
  }),
);

export type RecipeInstructionsResult = z.infer<typeof recipeInstructionsSchema>;
