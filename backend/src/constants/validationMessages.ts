export const validationMessages = {
  recipes: {
    invalidParameters: "Invalid parameters",
    unableToRetrieve: "Unable to retrieve recipes",
    searchError: "Error while searching for recipes",
    invalidId: "Invalid recipe ID",
  },

  ingredients: {
    required: "You must specify at least one ingredient",
    onlyWords: "Only words are allowed",
  },
} as const;
