export type Ingredient = {
  id: number;
  image: string;
  name: string;
  amount: number;
  unit: string;
};

export interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount?: number;
  usedIngredients?: Ingredient[];
  missedIngredientCount?: number;
  missedIngredients?: Ingredient[];
  isFavorite?: boolean;
}

export interface CollapsibleSectionProps {
  ingredientsType: string;
  ingredientsCount: number;
  isOpen: boolean;
  onToggle: () => void;
  ingredientsArray: Ingredient[];
}

export interface RecipeInstructions {
  isFavorite?: boolean;
  name: string;
  steps: {
    equipment: {
      id: number;
      name: string;
      temperature?: {
        number: number;
        unit: string;
      };
    }[];
    ingredients: {
      id: number;
      name: string;
    }[];
    length?: {
      number: number;
      unit: string;
    };
    number: number;
    step: string;
  }[];
  totalEquipment: string[];
  totalIngredients: string[];
}

export type FavoriteRecipe = {
  recipeName: string;
  recipeImage: string;
  recipeId: number;
};
