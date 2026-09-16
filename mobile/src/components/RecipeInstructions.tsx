import { View, Image, Text, StyleSheet, ScrollView } from "react-native";
import FavoriteButton from "./FavoriteButton";
import { useRecipes } from "../context/RecipeContext";

export default function RecipeInstructions() {
  const { recipeInstructions } = useRecipes();

  function InfoList({ title, items }: { title: string; items: string[] }) {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>{title}</Text>

        {items.map((item) => (
          <Text key={item} style={styles.infoList}>
            • {item}
          </Text>
        ))}
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Instruction</Text>

      <ScrollView style={styles.container}>
        {recipeInstructions.map((recipe) => (
          <View key={recipe.title}>
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <View style={styles.nameContainer}>
              <FavoriteButton
                isFavorite={recipe.isFavorite}
                recipeName={recipe.title}
                recipeImage={recipe.image}
                recipeId={recipe.id}
              />
              <Text style={styles.name}>{recipe.title}</Text>
            </View>
            <View style={styles.infoContainers}>
              <InfoList title="Ingredients" items={recipe.totalIngredients} />
              <InfoList title="Tools" items={recipe.totalEquipment} />
            </View>
            <View>
              <Text style={styles.stepsTitle}>Steps</Text>
              {recipe.steps.map((step) => (
                <View key={step.number}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>{step.number}</Text>
                    <View style={styles.stepNumberLine} />
                  </View>

                  <Text style={styles.stepText}>{step.step}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
    marginBottom: 160,
  },

  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    paddingBottom: 15,
    borderBottomColor: "green",
    borderBottomWidth: 2,
    marginTop: 50,
    marginBottom: 30,
  },

  nameContainer: {
    flexDirection: "row",
    paddingBottom: 4,
    borderBottomColor: "#457d002d",
    borderBottomWidth: 2,
  },

  name: {
    width: "100%",
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 20,
  },

  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    marginBottom: 20,
  },

  infoContainers: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
    marginBottom: 10,
  },

  infoContainer: {
    alignItems: "flex-start",
  },

  infoListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  infoTitle: {
    textAlign: "center",
    fontSize: 22,
    marginTop: 10,
    marginBottom: 5,
    borderBottomColor: "#457d002d",
    borderBottomWidth: 1,
  },

  infoList: {
    fontSize: 16,
  },

  stepsTitle: {
    textAlign: "center",
    fontSize: 22,
    marginTop: 10,
  },

  stepNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  stepNumber: {
    textAlign: "center",
    height: 30,
    width: 30,
    color: "#ffffff",
    fontSize: 20,
    borderRadius: 50,
    backgroundColor: "#457d002d",
  },

  stepNumberLine: {
    flex: 1,
    height: 3,
    backgroundColor: "#457d002d",
  },

  stepText: { paddingHorizontal: 35, fontSize: 16, marginBottom: 15 },
});
