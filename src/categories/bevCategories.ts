const beverageCategories = [
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

enum beverageCategoriesEnum {
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

export { beverageCategories, beverageCategoriesEnum };
