import { z } from "zod";

export const recipeIdParamSchema = z.coerce.number().int().positive();
