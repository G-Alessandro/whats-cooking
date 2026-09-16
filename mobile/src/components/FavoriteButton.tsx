import { TouchableOpacity, StyleSheet, Alert, View } from "react-native";
import FavoriteFilledSvg from "../assets/svg/favorite/favorite-filled.svg";
import FavoriteOutlineSvg from "../assets/svg/favorite/favorite-outline.svg";
import {
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "../services/favorites.services";
import { getValidAccessToken } from "../services/token.services";
import LoadingIcon from "./LoadingIcon";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

type FavoriteButtonProps = {
  isFavorite?: boolean;
  recipeName: string;
  recipeImage: string;
  recipeId: number;
};

export default function FavoriteButton({
  isFavorite = false,
  recipeName,
  recipeImage,
  recipeId,
}: FavoriteButtonProps) {
  const [recipeIsFavorite, setRecipeIsFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const { accessToken, setAccessToken } = useAuth();

  async function handleAddFavoriteRecipe() {
    try {
      setLoading(true);

      if (!accessToken) {
        Alert.alert(
          "Login required",
          "You must log in to save a recipe to your favorites.",
        );

        return;
      }
      const newAccessToken = await getValidAccessToken(accessToken);
      await addFavoriteRecipe(
        recipeName,
        recipeImage,
        recipeId,
        newAccessToken,
      );
      setAccessToken(newAccessToken);
      setRecipeIsFavorite(true);
    } catch (error) {
      if (error instanceof Error && error.message === "AUTH_REQUIRED") {
        Alert.alert(
          "Login required",
          "You must login to save a recipe to your favorites.",
        );

        return;
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFavoriteRecipe() {
    try {
      if (!accessToken) {
        Alert.alert(
          "Login required",
          "You must login to remove a recipe to your favorites.",
        );

        return;
      }
      const newAccessToken = await getValidAccessToken(accessToken);
      await removeFavoriteRecipe(recipeId, newAccessToken);
      setAccessToken(newAccessToken);
      setRecipeIsFavorite(false);
    } catch (error) {
      if (error instanceof Error && error.message === "AUTH_REQUIRED") {
        Alert.alert(
          "Login required",
          "You must login to remove a recipe to your favorites.",
        );

        return;
      }
    }
  }

  return (
    <View>
      {!loading && (
        <TouchableOpacity
          style={styles.button}
          onPress={
            recipeIsFavorite
              ? handleRemoveFavoriteRecipe
              : handleAddFavoriteRecipe
          }
        >
          {recipeIsFavorite ? <FavoriteFilledSvg /> : <FavoriteOutlineSvg />}
        </TouchableOpacity>
      )}
      {loading && <LoadingIcon width={35} height={35} />}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 35,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
  },
});
