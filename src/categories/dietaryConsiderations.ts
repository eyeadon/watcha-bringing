const dietaryConsiderations = [
  "gluten free",
  "dairy free",
  "vegetarian",
  "pescatarian",
  "vegan",
  "spicy",
  "other",
] as const;

enum dietaryConsiderationsEnum {
  glutenFree = "gluten free",
  dairyFree = "dairy free",
  vegetarian = "vegetarian",
  pescatarian = "pescatarian",
  vegan = "vegan",
  spicy = "spicy",
  other = "other",
}

export { dietaryConsiderations, dietaryConsiderationsEnum };
