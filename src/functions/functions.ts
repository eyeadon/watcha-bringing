import { Dish, Bev } from "../interfaces/interfaces";

function visibleItemsFilterHelper(
  arr: Dish[] | Bev[] | undefined,
  selCat: string,
  allCats: string
) {
  if (arr === undefined) return [];
  if (selCat === allCats) return arr;

  return selCat
    ? arr.filter((element: Dish | Bev) => element.category === selCat)
    : arr;
}

function capitalizeFirstLetter(string: string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : null;
}

export { visibleItemsFilterHelper, capitalizeFirstLetter };
