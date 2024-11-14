const dishCategories = [
  "appetizer",
  "side",
  "snack",
  "entree",
  "dessert",
  "other",
] as const;

enum dishCategoriesEnum {
  appetizer = "appetizer",
  side = "side",
  snack = "snack",
  entree = "entree",
  dessert = "dessert",
  other = "other",
}

export { dishCategories, dishCategoriesEnum };
