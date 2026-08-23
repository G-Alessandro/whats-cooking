import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { apiMessages } from "../constants/apiMessages";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      error: apiMessages.authentication.middleware.required,
    });
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      error: apiMessages.authentication.middleware.invalid,
    });
  }

  try {
    const payload = verifyAccessToken(token);

    req.userId = payload.userId;

    next();
  } catch {
    return res.status(401).json({
      error: apiMessages.authentication.middleware.invalid,
    });
  }
}
