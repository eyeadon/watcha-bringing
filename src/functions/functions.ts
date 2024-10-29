import { Dayjs } from "dayjs";
import {
  Dish,
  Bev,
  BevDocumentType,
  DishDocumentType,
} from "../interfaces/interfaces";

// function overload signatures
export function visibleItemsFilterHelper(
  arr: DishDocumentType[] | undefined,
  selCat: string,
  allCats: string
): DishDocumentType[];

export function visibleItemsFilterHelper(
  arr: BevDocumentType[] | undefined,
  selCat: string,
  allCats: string
): BevDocumentType[];

export function visibleItemsFilterHelper(
  arr: DishDocumentType[] | BevDocumentType[] | undefined,
  selCat: string,
  allCats: string
): DishDocumentType[] | BevDocumentType[] {
  if (arr === undefined) return [];
  if (selCat === allCats) return arr;

  return selCat
    ? arr.filter(
        (element: DishDocumentType | BevDocumentType) =>
          element.category === selCat
      )
    : arr;
}

export function capitalizeFirstLetter(string: string | undefined) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}

export function dayJsObjectToHourAndMinute(obj: Dayjs) {
  const hour = obj.get("hour");
  const minute = obj.get("minute");
  return hour + ":" + (minute ? minute : "00");
}

export function setDateDayJs(newDateObj: Dayjs, oldDateObj: Dayjs) {
  return oldDateObj
    .set("month", newDateObj.month())
    .set("day", newDateObj.day())
    .set("year", newDateObj.year());
}
