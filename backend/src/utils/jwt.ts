import jwt, { JwtPayload } from "jsonwebtoken";

interface AccessTokenPayload extends JwtPayload {
  userId: number;
}

function getJwtAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
  }

  return secret;
}

export function generateAccessToken(userId: number) {
  return jwt.sign(
    {
      userId,
    },
    getJwtAccessSecret(),
    {
      expiresIn: "15m",
    },
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, getJwtAccessSecret());
  return payload as AccessTokenPayload;
}
