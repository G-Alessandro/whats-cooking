import { Request, Response } from "express";
import {
  userSchema,
  refreshTokenSchema,
} from "../schemas/authentication.schema";
import {
  registrationUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../services/authentication.service";
import { apiMessages } from "../constants/apiMessages";

export async function registration(req: Request, res: Response) {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: apiMessages.authentication.registration.invalidData,
    });
  }

  try {
    const user = await registrationUser(
      result.data.email,
      result.data.password,
    );

    return res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: apiMessages.authentication.registration.unableToRegister,
    });
  }
}

export async function login(req: Request, res: Response) {
  const parsedResult = userSchema.safeParse(req.body);

  if (!parsedResult.success) {
    return res.status(400).json({
      error: apiMessages.authentication.login.invalidCredentials,
    });
  }

  const { email, password } = parsedResult.data;

  try {
    const result = await loginUser(email, password);

    if (!result) {
      return res.status(401).json({
        error: apiMessages.authentication.login.invalidData,
      });
    }

    return res.status(200).json(result).json({
      message: apiMessages.authentication.login.loggedIn,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: apiMessages.authentication.login.loginFailed,
    });
  }
}

export async function refresh(req: Request, res: Response) {
  const parsedResult = refreshTokenSchema.safeParse(req.body);

  if (!parsedResult.success) {
    return res.status(400).json({
      error: apiMessages.authentication.refreshToken.invalid,
    });
  }

  try {
    const accessToken = await refreshAccessToken(
      parsedResult.data.refreshToken,
    );

    if (!accessToken) {
      return res.status(401).json({
        error: apiMessages.authentication.refreshToken.invalidOrExpired,
      });
    }

    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: apiMessages.authentication.refreshToken.unableToRefresh,
    });
  }
}

export async function logout(req: Request, res: Response) {
  const parsedResult = refreshTokenSchema.safeParse(req.body);

  if (!parsedResult.success) {
    return res.status(400).json({
      error: apiMessages.authentication.logout.invalidCredentials,
    });
  }

  try {
    await logoutUser(parsedResult.data.refreshToken);

    return res.status(204).json({
      message: apiMessages.authentication.logout.logoutSuccessful,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: apiMessages.authentication.logout.failedLogout,
    });
  }
}
