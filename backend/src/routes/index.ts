import { Router } from "express";
import recipeRouter from "./recipes.routes";
import authenticationRouter from "./authentication.routes";
import favoriteRouter from "./favorites.routes";
import { authenticate } from "../middleware/authentication";

const router = Router();

router.use("/recipes", recipeRouter);

router.use("/authentication", authenticationRouter);

router.use("/favorites", authenticate, favoriteRouter);

export default router;
