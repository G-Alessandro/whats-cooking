import { z } from "zod";
import { validationMessages } from "../constants/validationMessages";

export const recipeIngredientsQuerySchema = z.object({
  ingredients: z
    .string()
    .min(1, validationMessages.ingredients.required)
    .transform((value) =>
      value
        .split(",")
        .map((ingredient) => ingredient.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(
          z
            .string()
            .regex(
              /^[\p{L}]+(?: [\p{L}]+)*$/u,
              validationMessages.ingredients.onlyWords,
            ),
        )
        .min(1),
    ),
});

const recipeIngredientSchema = z.object({
  id: z.number(),
  image: z.string(),
  name: z.string(),
  amount: z.number(),
  unit: z.string(),
});

export const recipeByIngredientsResultSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    image: z.string(),
    usedIngredientCount: z.number().optional(),
    usedIngredients: z.array(recipeIngredientSchema).optional(),
    missedIngredientCount: z.number().optional(),
    missedIngredients: z.array(recipeIngredientSchema).optional(),
  }),
);

export const recipeIdParamsSchema = z.coerce
  .number()
  .int()
  .min(1, validationMessages.recipes.invalidId);

export const recipeInstructionsSchema = z.array(
  z.object({
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

export type RecipeInstructions = z.infer<typeof recipeInstructionsSchema>;
