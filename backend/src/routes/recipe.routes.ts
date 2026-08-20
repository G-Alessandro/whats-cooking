import { Router } from "express";

import {
  searchRecipes,
  findRecipeInstructions,
} from "../controllers/recipe.controller";

const router = Router();

router.get("/", searchRecipes);

router.get("/:recipeId", findRecipeInstructions);

export default router;
