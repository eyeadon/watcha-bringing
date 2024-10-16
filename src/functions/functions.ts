import { Dish, Bev } from "../interfaces/interfaces";

export function visibleItemsFilterHelper(
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

export function capitalizeFirstLetter(string: string | undefined) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}
