import { Router } from "express";
import recipeRouter from "./recipes.routes";
import authenticationRouter from "./authentication.routes";
import favoriteRouter from "./favorites.routes";
import {
  authenticate,
  optionalAuthenticate,
} from "../middleware/authentication";

const router = Router();

router.use("/recipes", optionalAuthenticate, recipeRouter);

router.use("/authentication", authenticationRouter);

router.use("/favorites", authenticate, favoriteRouter);

export default router;
