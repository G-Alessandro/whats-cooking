import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import { refreshAccessToken } from "./authentication.services";

type TokenPayload = {
  exp: number;
};

const REFRESH_TOKEN_KEY = "refresh_token";

export async function saveRefreshToken(token: string) {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

function isAccessTokenExpiringSoon(accessToken: string, bufferSeconds = 60) {
  const payload = jwtDecode<TokenPayload>(accessToken);

  return payload.exp * 1000 <= Date.now() + bufferSeconds * 1000;
}

export async function getValidAccessToken(accessToken: string) {
  let token = accessToken;

  if (isAccessTokenExpiringSoon(token)) {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error("AUTH_REQUIRED");
    }

    token = await refreshAccessToken(refreshToken);
  }

  return token;
}
