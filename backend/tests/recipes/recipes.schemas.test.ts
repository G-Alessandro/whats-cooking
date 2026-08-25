import { describe, it, expect } from "vitest";
import {
  recipeIngredientsQuerySchema,
  recipeByIngredientsResultSchema,
  recipeIdParamsSchema,
  recipeInstructionsSchema,
} from "../../src/schemas/recipes.schema";

const validIngredientsList = "chicken, tomatoes, crème fraîche";
const ingredientsListWithSpace = "  chicken  ,  tomatoes,  crème fraîche ";
const ingredientsListWithEmptyElements = "chicken, ,tomatoes,onions,,,";
const ingredientsListWithEmptyString = "";
const ingredientsListWithInvalidType = "chicken, 3, onions";

const validRecipeId = "3";
const recipeWithDecimalId = "3.5";
const recipeWithWordId = "abc";
const recipeWithNegativeId = "-7";
const recipeWithZeroId = "0";
const emptyRecipeId = "";

const validSpoonacularResponse = [
  {
    id: 123,
    title: "chicken rice",
    image: "https://example.com/recipe.jpg",
    usedIngredientCount: 2,
    usedIngredients: [
      {
        id: 1,
        image: "https://example.com/chicken.jpg",
        name: "chicken",
        amount: 200,
        unit: "g",
      },
    ],
    missedIngredientCount: 1,
    missedIngredients: [
      {
        id: 2,
        image: "https://example.com/rice.jpg",
        name: "rice",
        amount: 100,
        unit: "g",
      },
    ],
  },
];
const validSpoonacularResponseWithoutOptional = [
  {
    id: 1,
    title: "recipe",
    image: "recipe1.jpg",
  },
];
const multipleValidSpoonacularResponse = [
  {
    id: 1,
    title: "recipe",
    image: "recipe1.jpg",
  },
  {
    id: 2,
    title: "recipe",
    image: "recipe2.jpg",
  },
  {
    id: 3,
    title: "recipe",
    image: "recipe3.jpg",
  },
];
const incompleteSpoonacularResponse = [
  {
    image: "recipe.jpg",
  },
];
const wrongSpoonacularResponseTypes = [
  {
    id: "123",
    title: "123",
    image: "123",
  },
];
const invalidSpoonacularResponseIngredient = [
  {
    id: 123,
    title: "chicken rice",
    image: "https://example.com/recipe.jpg",
    usedIngredientCount: 2,
    usedIngredients: [
      {
        id: "invalid",
        image: "https://example.com/chicken.jpg",
        name: "chicken",
        amount: 200,
        unit: "g",
      },
    ],
  },
];
const wrongDataTypeSpoonacularResponse = {
  id: 123,
  title: "chicken rice",
  image: "recipe.jpg",
};

const validRecipeInstructions = [
  {
    name: "",
    steps: [
      {
        equipment: [
          {
            id: 1,
            name: "Oven",
            temperature: {
              number: 180,
              unit: "C",
            },
          },
        ],
        ingredients: [
          {
            id: 1001,
            name: "Flour",
          },
        ],
        length: {
          number: 30,
          unit: "minutes",
        },
        number: 1,
        step: "Preheat the oven to 180°C.",
      },
    ],
  },
];

describe("recipe ingredients query schema", () => {
  it("accepts valid ingredients", () => {
    const result = recipeIngredientsQuerySchema.safeParse({
      ingredients: validIngredientsList,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ingredients).toEqual([
        "chicken",
        "tomatoes",
        "crème fraîche",
      ]);
    }
  });

  it("transform the string into an array", () => {
    const result = recipeIngredientsQuerySchema.safeParse({
      ingredients: validIngredientsList,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(Array.isArray(result.data.ingredients)).toBe(true);
    }
  });

  it("remove spaces", () => {
    const result = recipeIngredientsQuerySchema.safeParse({
      ingredients: ingredientsListWithSpace,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ingredients).toEqual([
        "chicken",
        "tomatoes",
        "crème fraîche",
      ]);
    }
  });

  it("removes empty elements", () => {
    const result = recipeIngredientsQuerySchema.safeParse({
      ingredients: ingredientsListWithEmptyElements,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ingredients).toEqual([
        "chicken",
        "tomatoes",
        "onions",
      ]);
    }
  });

  it("rejects an empty string", () => {
    const result = recipeIngredientsQuerySchema.safeParse({
      ingredients: ingredientsListWithEmptyString,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toEqual(
        "You must specify at least one ingredient",
      );
    }
  });

  it("rejects an invalid type", () => {
    const result = recipeIngredientsQuerySchema.safeParse({
      ingredients: ingredientsListWithInvalidType,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toEqual("Only words are allowed");
    }
  });
});

describe("spoonacular recipe response schema", () => {
  it("accepts a valid response", () => {
    const result = recipeByIngredientsResultSchema.safeParse(
      validSpoonacularResponse,
    );
    expect(result.success).toBe(true);
  });

  it("accepts without optional fields", () => {
    const result = recipeByIngredientsResultSchema.safeParse(
      validSpoonacularResponseWithoutOptional,
    );

    expect(result.success).toBe(true);
  });

  it("accepts multiple recipes", () => {
    const result = recipeByIngredientsResultSchema.safeParse(
      multipleValidSpoonacularResponse,
    );
    expect(result.success).toBe(true);
  });

  it("rejects without required fields", () => {
    const result = recipeByIngredientsResultSchema.safeParse(
      incompleteSpoonacularResponse,
    );
    expect(result.success).toBe(false);
  });

  it("rejects with invalid type fields", () => {
    const result = recipeByIngredientsResultSchema.safeParse(
      wrongSpoonacularResponseTypes,
    );
    expect(result.success).toBe(false);
  });

  it("rejects with invalid ingredient", () => {
    const result = recipeByIngredientsResultSchema.safeParse(
      invalidSpoonacularResponseIngredient,
    );
    expect(result.success).toBe(false);
  });

  it("accepts an empty result", () => {
    const result = recipeByIngredientsResultSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it("rejects a non-array response", () => {
    const result = recipeByIngredientsResultSchema.safeParse(
      wrongDataTypeSpoonacularResponse,
    );
    expect(result.success).toBe(false);
  });
});

describe("recipe ID params schema", () => {
  it("accepts a valid id", () => {
    const result = recipeIdParamsSchema.safeParse(validRecipeId);

    expect(result.success).toBe(true);
  });

  it("rejects a decimal id", () => {
    const result = recipeIdParamsSchema.safeParse(recipeWithDecimalId);

    expect(result.success).toBe(false);
  });

  it("rejects a word id", () => {
    const result = recipeIdParamsSchema.safeParse(recipeWithWordId);

    expect(result.success).toBe(false);
  });

  it("rejects a negative id", () => {
    const result = recipeIdParamsSchema.safeParse(recipeWithNegativeId);

    expect(result.success).toBe(false);
  });

  it("rejects zero as an id", () => {
    const result = recipeIdParamsSchema.safeParse(recipeWithZeroId);

    expect(result.success).toBe(false);
  });

  it("rejects an empty id", () => {
    const result = recipeIdParamsSchema.safeParse(emptyRecipeId);

    expect(result.success).toBe(false);
  });
});

describe("recipe instructions schema", () => {
  it("accepts valid recipe instructions", () => {
    const result = recipeInstructionsSchema.safeParse(validRecipeInstructions);
    expect(result.success).toBe(true);
  });

  it("accepts an empty array", () => {
    const result = recipeInstructionsSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it("accepts optional temperature", () => {
    const recipe = [
      {
        name: "",
        steps: [
          {
            equipment: [
              {
                id: 1,
                name: "Oven",
              },
            ],
            ingredients: [],
            number: 1,
            step: "Preheat the oven.",
          },
        ],
      },
    ];
    const result = recipeInstructionsSchema.safeParse(recipe);
    expect(result.success).toBe(true);
  });

  it("accepts optional length", () => {
    const recipe = [
      {
        name: "",
        steps: [
          {
            equipment: [
              {
                id: 1,
                name: "Oven",
              },
            ],
            ingredients: [],
            length: undefined,
            number: 1,
            step: "Preheat the oven.",
          },
        ],
      },
    ];
    const result = recipeInstructionsSchema.safeParse(recipe);
    expect(result.success).toBe(true);
  });

  it("rejects a non-array value", () => {
    const result = recipeInstructionsSchema.safeParse(
      "invalid recipe instructions",
    );
    expect(result.success).toBe(false);
  });

  it("rejects a recipe without steps", () => {
    const recipe = [
      {
        name: "",
      },
    ];
    const result = recipeInstructionsSchema.safeParse(recipe);
    expect(result.success).toBe(false);
  });

  it("rejects a step without equipment", () => {
    const recipe = [
      {
        name: "",
        steps: [{}],
      },
    ];
    const result = recipeInstructionsSchema.safeParse(recipe);
    expect(result.success).toBe(false);
  });

  it("rejects an equipment item with an invalid id", () => {
    const recipe = [
      {
        name: "",
        steps: [
          {
            equipment: [
              {
                id: "1",
                name: "Oven",
                ingredients: [],
                number: 1,
                step: "Preheat the oven.",
              },
            ],
          },
        ],
      },
    ];
    const result = recipeInstructionsSchema.safeParse(recipe);
    expect(result.success).toBe(false);
  });

  it("rejects an equipment item with invalid temperature", () => {
    const recipe = [
      {
        name: "",
        steps: [
          {
            equipment: [
              {
                id: 1,
                name: "Oven",
                temperature: {
                  number: "180",
                  unit: "C",
                },
                ingredients: [],
                number: 1,
                step: "Preheat the oven.",
              },
            ],
          },
        ],
      },
    ];
    const result = recipeInstructionsSchema.safeParse(recipe);
    expect(result.success).toBe(false);
  });

  it("rejects an ingredient without a name", () => {
    const recipe = [
      {
        name: "",
        steps: [
          {
            equipment: [
              {
                id: 1,
                name: "Oven",
                ingredients: [
                  {
                    id: 1001,
                  },
                ],
                number: 1,
                step: "Preheat the oven.",
              },
            ],
          },
        ],
      },
    ];
    const result = recipeInstructionsSchema.safeParse(recipe);
    expect(result.success).toBe(false);
  });

  it("rejects an equipment item without a step", () => {
    const recipe = [
      {
        name: "",
        steps: [
          {
            equipment: [
              {
                id: 1,
                name: "Oven",
                ingredients: [],
                number: 1,
              },
            ],
          },
        ],
      },
    ];
    const result = recipeInstructionsSchema.safeParse(recipe);
    expect(result.success).toBe(false);
  });
});
