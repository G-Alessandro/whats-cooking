import { z } from "zod";

export const userSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
