const API_BACKEND_URL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export async function registerUser(email: string, password: string) {
  const response = await fetch(
    `${API_BACKEND_URL}/authentication/registration`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Registration failed");
  }

  return data;
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BACKEND_URL}/authentication/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Login failed");
  }

  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(`${API_BACKEND_URL}/authentication/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to refresh session");
  }

  return data.accessToken;
}

export async function logoutUser(refreshToken: string) {
  const response = await fetch(`${API_BACKEND_URL}/authentication/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to logout");
  }

  return data;
}
