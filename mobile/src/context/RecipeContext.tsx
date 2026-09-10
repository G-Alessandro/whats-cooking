import { createContext, useContext, useState } from "react";
import type {
  RecipesListResult,
  RecipeInstructionsResult,
} from "../schemas/recipes.schemas";

type RecipeContextType = {
  recipesList: RecipesListResult;
  setRecipesList: (recipes: RecipesListResult) => void;

  recipeInstructions: RecipeInstructionsResult;
  setRecipeInstructions: (recipes: RecipeInstructionsResult) => void;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipesList, setRecipesList] = useState<RecipesListResult>([]);
  const [recipeInstructions, setRecipeInstructions] =
    useState<RecipeInstructionsResult>([]);

  return (
    <RecipeContext.Provider
      value={{
        recipesList,
        setRecipesList,
        recipeInstructions,
        setRecipeInstructions,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error("useRecipes must be used inside RecipeProvider");
  }

  return context;
}
