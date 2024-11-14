const bevCategories = [
  "soda",
  "seltzer",
  "beer",
  "wine",
  "cocktail",
  "juice",
  "coffee",
  "tea",
  "other",
] as const;

enum bevCategoriesEnum {
  soda = "soda",
  seltzer = "seltzer",
  beer = "beer",
  wine = "wine",
  cocktail = "cocktail",
  juice = "juice",
  coffee = "coffee",
  tea = "tea",
  other = "other",
}

export { bevCategories, bevCategoriesEnum };
