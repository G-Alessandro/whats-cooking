import { describe, expect, it } from "vitest";
import { mapRecipeInstructions } from "../../src/mappers/recipe.mapper";

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
