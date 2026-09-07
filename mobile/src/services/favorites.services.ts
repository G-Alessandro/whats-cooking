const API_BACKEND_URL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export async function addFavoriteRecipe(
  recipeName: string,
  recipeImage: string,
  recipeId: number,
  accessToken: string,
) {
  const response = await fetch(`${API_BACKEND_URL}/favorites`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipeName,
      recipeImage,
      recipeId,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to add favorite");
  }

  return response.json();
}

export async function removeFavoriteRecipe(
  recipeId: number,
  accessToken: string,
) {
  const response = await fetch(`${API_BACKEND_URL}/favorites/${recipeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to remove favorite");
  }

  return response.json();
}
