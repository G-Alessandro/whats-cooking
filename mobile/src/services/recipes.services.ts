const API_BACKEND_URL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export async function getRecipesByIngredients(
  ingredients: string[],
  accessToken?: string | null,
) {
  const query = encodeURIComponent(ingredients.join(","));

  const headers: HeadersInit = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(
    `${API_BACKEND_URL}/recipes?ingredients=${query}`,
    {
      headers,
    },
  );

  if (!response.ok) {
    throw new Error("Unable to get recipes");
  }

  return response.json();
}

export async function getRecipeInstructions(
  recipeId: number,
  accessToken?: string | null,
) {
  const headers: HeadersInit = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BACKEND_URL}/recipes/${recipeId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Unable to get recipe instructions");
  }

  return response.json();
}
