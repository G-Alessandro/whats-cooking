import { Router } from "express";

import {
  registration,
  login,
  refresh,
  logout,
} from "../controllers/authentication.controller";

const router = Router();

router.post("/registration", registration);

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", logout);

export default router;
