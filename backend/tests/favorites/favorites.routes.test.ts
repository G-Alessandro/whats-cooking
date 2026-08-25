import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import prisma from "../../src/clients/prisma.client";
import { generateAccessToken } from "../../src/utils/jwt";
import * as favoriteRecipeService from "../../src/services/favorites.service";
import app from "../../src/app";

interface FavoriteRecipes {
  id: number;
  recipeId: number;
  userId: number;
}

let userId: number;
const recipeId = 1;
const newRecipeId = 3;
let accessToken: string;
let favoriteRecipes: FavoriteRecipes[];

beforeEach(async () => {
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: hashedPassword,
    },
  });

  userId = user.id;
  accessToken = generateAccessToken(userId);

  favoriteRecipes = await prisma.favoriteRecipe.createManyAndReturn({
    data: [
      {
        recipeId: 1,
        userId: user.id,
      },
      {
        recipeId: 2,
        userId: user.id,
      },
    ],
  });
});

describe("GET /favorites", () => {
  it("reject unauthenticated users", async () => {
    const response = await request(app).get(`/favorites`);
    expect(response.status).toBe(401);
  });

  it("return favorite recipes", async () => {
    const response = await request(app)
      .get("/favorites")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      favoriteRecipes.map(({ id, recipeId, userId }) => ({
        id,
        recipeId,
        userId,
      })),
    );
  });

  it("reject when service throws an error", async () => {
    vi.spyOn(favoriteRecipeService, "getFavoriteRecipes").mockRejectedValue(
      new Error("Service error"),
    );
    const response = await request(app)
      .get("/favorites")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(500);
  });
});

describe("POST /favorites/:recipeId", () => {
  it("reject unauthenticated users", async () => {
    const response = await request(app).post(`/favorites/${recipeId}`);

    expect(response.status).toBe(401);
  });

  it("reject when recipeId is invalid", async () => {
    const response = await request(app)
      .post("/favorites/invalid-id")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it("add a recipe to favorites", async () => {
    const response = await request(app)
      .post(`/favorites/${newRecipeId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(201);
  });

  it("recipe is already a favorite", async () => {
    const response = await request(app)
      .post(`/favorites/${recipeId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(409);
  });

  it("reject when service throws an error", async () => {
    vi.spyOn(favoriteRecipeService, "addFavoriteRecipe").mockRejectedValue(
      new Error("Spoonacular unavailable"),
    );
    const response = await request(app)
      .post(`/favorites/${newRecipeId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(500);
  });
});

describe("DELETE /favorites/:recipeId", () => {
  it("reject unauthenticated users", async () => {
    const response = await request(app).delete(`/favorites/${recipeId}`);
    expect(response.status).toBe(401);
  });

  it("reject invalid recipeId", async () => {
    const response = await request(app)
      .delete(`/favorites/invalid-id`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(400);
  });

  it("remove a recipe from favorites", async () => {
    const response = await request(app)
      .delete(`/favorites/${recipeId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(204);
    const favorite = await prisma.favoriteRecipe.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    expect(favorite).toBeNull();
  });

  it("reject when favorite does not exist", async () => {
    const response = await request(app)
      .delete(`/favorites/${newRecipeId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(404);
  });

  it("reject when service throws an error", async () => {
    vi.spyOn(favoriteRecipeService, "removeFavoriteRecipe").mockRejectedValue(
      new Error("Spoonacular unavailable"),
    );
    const response = await request(app)
      .delete(`/favorites/${recipeId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(500);
  });
});
