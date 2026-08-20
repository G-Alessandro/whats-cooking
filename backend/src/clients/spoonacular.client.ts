import { apiMessages } from "../constants/apiMessages";

export const spoonacularFetch = async (
  endpoint: string,
  params: Record<string, string>,
) => {
  const apiKey = process.env.SPOONACULAR_API_KEY;

  if (!apiKey) {
    throw new Error(apiMessages.spoonacular.apiKeyNotConfigured);
  }

  const searchParams = new URLSearchParams({
    ...params,
    apiKey,
  });

  const response = await fetch(
    `${process.env.SPOONACULAR_URL}${endpoint}?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error(
      `${apiMessages.spoonacular.requestFailed}: ${response.status}`,
    );
  }

  return response.json();
};
