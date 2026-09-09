import { createContext, useContext, useState } from "react";
import type { RecipesListResult } from "../schemas/recipes.schemas";

type RecipeContextType = {
  recipesList: RecipesListResult;
  setRecipesList: (recipes: RecipesListResult) => void;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipesList, setRecipesList] = useState<RecipesListResult>([]);

  return (
    <RecipeContext.Provider value={{ recipesList, setRecipesList }}>
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
