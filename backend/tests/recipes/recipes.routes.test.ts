import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as spoonacularService from "../../src/services/recipes.service";
import {
  spoonacularRecipesMock,
  spoonacularRecipeInstructionsMock,
} from "../mocks/spoonacular.mock";
import request from "supertest";

import app from "../../src/app";

const validIngredientParameters = "chicken, tomatoes, onions";
const invalidIngredientParameters = "chicken, 3, onions";
const emptyIngredientParameters = "";
const validRecipeId = "641904";
const invalidRecipeId = "041904.6";

describe("GET /recipes", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => spoonacularRecipesMock,
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("request with valid ingredients", async () => {
    const response = await request(app).get("/recipes").query({
      ingredients: validIngredientParameters,
    });
    expect(response.status).toBe(200);
  });

  it("request with wrong ingredient type", async () => {
    const response = await request(app).get("/recipes").query({
      ingredients: invalidIngredientParameters,
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: ["Only words are allowed"],
    });
  });

  it("request with empty ingredients", async () => {
    const response = await request(app).get("/recipes").query({
      ingredients: emptyIngredientParameters,
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: ["You must specify at least one ingredient"],
    });
  });

  it("returns 500 when Spoonacular service fails", async () => {
    vi.spyOn(spoonacularService, "findRecipesByIngredients").mockRejectedValue(
      new Error("Spoonacular API error"),
    );

    const response = await request(app).get("/recipes").query({
      ingredients: validIngredientParameters,
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Error while searching for recipes",
    });
  });

  it("returns 502 when Spoonacular returns invalid data", async () => {
    vi.spyOn(spoonacularService, "findRecipesByIngredients").mockResolvedValue({
      invalid: "data",
    });

    const response = await request(app).get("/recipes").query({
      ingredients: validIngredientParameters,
    });

    expect(response.status).toBe(502);

    expect(response.body).toEqual({
      error: "Unable to retrieve recipes",
    });
  });
});

describe("GET /recipes/:recipeId", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => spoonacularRecipeInstructionsMock,
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("request with valid ID", async () => {
    const response = await request(app).get(`/recipes/${validRecipeId}`);
    expect(response.status).toBe(200);
  });

  it("request with invalid ID", async () => {
    const response = await request(app).get(`/recipes/${invalidRecipeId}`);
    expect(response.status).toBe(400);
  });

  it("returns 500 when retrieving recipe instructions fails", async () => {
    vi.spyOn(
      spoonacularService,
      "findRecipeInstructionsById",
    ).mockRejectedValue(new Error("Spoonacular unavailable"));
    const response = await request(app).get(`/recipes/${validRecipeId}`);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Error while retrieving recipe instructions",
    });
  });
});
