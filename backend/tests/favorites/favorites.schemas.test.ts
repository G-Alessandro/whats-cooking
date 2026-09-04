import { describe, it, expect } from "vitest";
import { favoriteRecipeIdParamSchema } from "../../src/schemas/favorites.schema";

const validRecipeId = "3";
const recipeWithDecimalId = "3.5";
const recipeWithWordId = "abc";
const recipeWithNegativeId = "-7";
const recipeWithZeroId = "0";
const emptyRecipeId = "";

describe("recipe ID params schema", () => {
  it("accepts a valid id", () => {
    const result = favoriteRecipeIdParamSchema.safeParse(validRecipeId);

    expect(result.success).toBe(true);
  });

  it("rejects a decimal id", () => {
    const result = favoriteRecipeIdParamSchema.safeParse(recipeWithDecimalId);

    expect(result.success).toBe(false);
  });

  it("rejects a word id", () => {
    const result = favoriteRecipeIdParamSchema.safeParse(recipeWithWordId);

    expect(result.success).toBe(false);
  });

  it("rejects a negative id", () => {
    const result = favoriteRecipeIdParamSchema.safeParse(recipeWithNegativeId);

    expect(result.success).toBe(false);
  });

  it("rejects zero as an id", () => {
    const result = favoriteRecipeIdParamSchema.safeParse(recipeWithZeroId);

    expect(result.success).toBe(false);
  });

  it("rejects an empty id", () => {
    const result = favoriteRecipeIdParamSchema.safeParse(emptyRecipeId);

    expect(result.success).toBe(false);
  });
});
