import { Router } from "express";
import {
  searchRecipes,
  findRecipeInstructions,
} from "../controllers/recipes.controller";

const router = Router();

router.get("/", searchRecipes);

router.get("/:recipeId", findRecipeInstructions);

export default router;
