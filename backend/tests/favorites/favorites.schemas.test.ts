import { describe, it, expect } from "vitest";
import {
  favoriteRecipeIdParamSchema,
  newFavoriteRecipeSchema,
} from "../../src/schemas/favorites.schema";

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

describe("new favorite recipe schema", () => {
  it("accept a valid favorite recipe", () => {
    const favoriteRecipe = {
      recipeName: "Easy Chicken Tandoori",
      recipeImage: "https://example.com/chicken-tandoori.jpg",
      recipeId: 641904,
    };

    const result = newFavoriteRecipeSchema.safeParse(favoriteRecipe);

    expect(result.success).toBe(true);
  });

  it("reject a recipe with an invalid recipeName", () => {
    const favoriteRecipe = {
      recipeName: 123,
      recipeImage: "https://example.com/chicken-tandoori.jpg",
      recipeId: 641904,
    };

    const result = newFavoriteRecipeSchema.safeParse(favoriteRecipe);

    expect(result.success).toBe(false);
  });

  it("reject a recipe with an invalid recipeImage", () => {
    const favoriteRecipe = {
      recipeName: "Easy Chicken Tandoori",
      recipeImage: 123,
      recipeId: 641904,
    };

    const result = newFavoriteRecipeSchema.safeParse(favoriteRecipe);

    expect(result.success).toBe(false);
  });

  it("reject a recipe with an invalid recipeId", () => {
    const favoriteRecipe = {
      recipeName: "Easy Chicken Tandoori",
      recipeImage: "https://example.com/chicken-tandoori.jpg",
      recipeId: "641904",
    };

    const result = newFavoriteRecipeSchema.safeParse(favoriteRecipe);

    expect(result.success).toBe(false);
  });

  it("reject a recipe with missing fields", () => {
    const favoriteRecipe = {
      recipeName: "Easy Chicken Tandoori",
    };

    const result = newFavoriteRecipeSchema.safeParse(favoriteRecipe);

    expect(result.success).toBe(false);
  });
});
