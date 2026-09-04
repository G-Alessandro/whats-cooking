import { Router } from "express";
import {
  getFavoriteRecipesController,
  addFavoriteRecipeController,
  removeFavoriteRecipeController,
} from "../controllers/favorites.controller";

const router = Router();

router.get("/", getFavoriteRecipesController);

router.post("/", addFavoriteRecipeController);

router.delete("/:recipeId", removeFavoriteRecipeController);

export default router;
