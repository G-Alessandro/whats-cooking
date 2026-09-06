import { describe, expect, it } from "vitest";
import { mapRecipeInstructions } from "../../src/mappers/recipes.mapper";
import { mapRecipesWithFavorites } from "../../src/mappers/recipes.mapper";
import { RecipesListResult } from "../../src/schemas/recipes.schema";
import { FavoriteRecipes } from "../../src/schemas/favorites.schema";

describe("mapRecipeInstructions", () => {
  it("adds total equipment and total ingredients", () => {
    const recipeInstructions = [
      {
        name: "Chicken Pasta",
        steps: [
          {
            number: 1,
            step: "Cut the chicken",
            equipment: [
              {
                id: 1,
                name: "Knife",
              },
            ],
            ingredients: [
              {
                id: 1,
                name: "Chicken",
              },
            ],
          },
          {
            number: 2,
            step: "Cook the pasta",
            equipment: [
              {
                id: 2,
                name: "Pot",
              },
            ],
            ingredients: [
              {
                id: 2,
                name: "Pasta",
              },
            ],
          },
        ],
      },
    ];

    const result = mapRecipeInstructions(recipeInstructions);

    expect(result).toEqual([
      {
        name: "Chicken Pasta",
        steps: recipeInstructions[0].steps,
        totalEquipment: ["Knife", "Pot"],
        totalIngredients: ["Chicken", "Pasta"],
      },
    ]);
  });

  it("removes duplicated equipment and ingredients", () => {
    const recipeInstructions = [
      {
        name: "Chicken Pasta",
        steps: [
          {
            number: 1,
            step: "Cut the chicken",
            equipment: [
              {
                id: 1,
                name: "Knife",
              },
            ],
            ingredients: [
              {
                id: 1,
                name: "Chicken",
              },
            ],
          },
          {
            number: 2,
            step: "Cut the chicken again",
            equipment: [
              {
                id: 1,
                name: "Knife",
              },
            ],
            ingredients: [
              {
                id: 1,
                name: "Chicken",
              },
            ],
          },
        ],
      },
    ];

    const result = mapRecipeInstructions(recipeInstructions);

    expect(result[0].totalEquipment).toEqual(["Knife"]);
    expect(result[0].totalIngredients).toEqual(["Chicken"]);
  });

  it("does not mix equipment and ingredients between recipes", () => {
    const recipeInstructions = [
      {
        name: "Chicken Pasta",
        steps: [
          {
            number: 1,
            step: "Cut chicken",
            equipment: [
              {
                id: 1,
                name: "Knife",
              },
            ],
            ingredients: [
              {
                id: 1,
                name: "Chicken",
              },
            ],
          },
        ],
      },
      {
        name: "Tomato Soup",
        steps: [
          {
            number: 1,
            step: "Cook tomatoes",
            equipment: [
              {
                id: 2,
                name: "Pot",
              },
            ],
            ingredients: [
              {
                id: 2,
                name: "Tomato",
              },
            ],
          },
        ],
      },
    ];

    const result = mapRecipeInstructions(recipeInstructions);

    expect(result[0].totalEquipment).toEqual(["Knife"]);
    expect(result[0].totalIngredients).toEqual(["Chicken"]);

    expect(result[1].totalEquipment).toEqual(["Pot"]);
    expect(result[1].totalIngredients).toEqual(["Tomato"]);
  });

  it("returns empty totals when there are no ingredients or equipment", () => {
    const recipeInstructions = [
      {
        name: "Simple Recipe",
        steps: [
          {
            number: 1,
            step: "Do something",
            equipment: [],
            ingredients: [],
          },
        ],
      },
    ];

    const result = mapRecipeInstructions(recipeInstructions);

    expect(result).toEqual([
      {
        name: "Simple Recipe",
        steps: recipeInstructions[0].steps,
        totalEquipment: [],
        totalIngredients: [],
      },
    ]);
  });

  it("returns an empty array when there are no recipes", () => {
    const result = mapRecipeInstructions([]);

    expect(result).toEqual([]);
  });
});

describe("mapRecipesWithFavorites", () => {
  it("mark a recipe as favorite when it is in the favorite recipes", () => {
    const recipes = [
      {
        id: 641904,
        title: "Easy Chicken Tandoori",
        image: "image.jpg",
      },
    ];

    const favoriteRecipes = [
      {
        recipeName: "Easy Chicken Tandoori",
        recipeImage: "image.jpg",
        recipeId: 641904,
      },
    ];

    const result = mapRecipesWithFavorites(recipes, favoriteRecipes);

    expect(result).toEqual([
      {
        id: 641904,
        title: "Easy Chicken Tandoori",
        image: "image.jpg",
        isFavorite: true,
      },
    ]);
  });

  it("mark a recipe as not favorite when it is not in the favorite recipes", () => {
    const recipes = [
      {
        id: 641904,
        title: "Easy Chicken Tandoori",
        image: "image.jpg",
      },
    ];

    const favoriteRecipes = [
      {
        recipeName: "Italian Chicken With Pepper",
        recipeImage: "image2.jpg",
        recipeId: 648097,
      },
    ];

    const result = mapRecipesWithFavorites(recipes, favoriteRecipes);

    expect(result).toEqual([
      {
        id: 641904,
        title: "Easy Chicken Tandoori",
        image: "image.jpg",
        isFavorite: false,
      },
    ]);
  });

  it("correctly mark multiple recipes", () => {
    const recipes = [
      {
        id: 641904,
        title: "Easy Chicken Tandoori",
        image: "image1.jpg",
      },
      {
        id: 648097,
        title: "Italian Chicken With Pepper",
        image: "image2.jpg",
      },
      {
        id: 655620,
        title: "Peperonata",
        image: "image3.jpg",
      },
    ];

    const favoriteRecipes = [
      {
        recipeName: "Easy Chicken Tandoori",
        recipeImage: "image1.jpg",
        recipeId: 641904,
      },
      {
        recipeName: "Peperonata",
        recipeImage: "image3.jpg",
        recipeId: 655620,
      },
    ];

    const result = mapRecipesWithFavorites(recipes, favoriteRecipes);

    expect(result).toEqual([
      {
        id: 641904,
        title: "Easy Chicken Tandoori",
        image: "image1.jpg",
        isFavorite: true,
      },
      {
        id: 648097,
        title: "Italian Chicken With Pepper",
        image: "image2.jpg",
        isFavorite: false,
      },
      {
        id: 655620,
        title: "Peperonata",
        image: "image3.jpg",
        isFavorite: true,
      },
    ]);
  });

  it("mark all recipes as not favorite when favorite recipes are empty", () => {
    const recipes = [
      {
        id: 641904,
        title: "Easy Chicken Tandoori",
        image: "image1.jpg",
      },
      {
        id: 648097,
        title: "Italian Chicken With Pepper",
        image: "image2.jpg",
      },
    ];

    const favoriteRecipes: FavoriteRecipes = [];
    const result = mapRecipesWithFavorites(recipes, favoriteRecipes);

    expect(result).toEqual([
      {
        id: 641904,
        title: "Easy Chicken Tandoori",
        image: "image1.jpg",
        isFavorite: false,
      },
      {
        id: 648097,
        title: "Italian Chicken With Pepper",
        image: "image2.jpg",
        isFavorite: false,
      },
    ]);
  });

  it("return an empty array when recipes are empty", () => {
    const recipes: RecipesListResult = [];
    const favoriteRecipes = [
      {
        recipeName: "Easy Chicken Tandoori",
        recipeImage: "image1.jpg",
        recipeId: 641904,
      },
    ];

    const result = mapRecipesWithFavorites(recipes, favoriteRecipes);

    expect(result).toEqual([]);
  });
});
