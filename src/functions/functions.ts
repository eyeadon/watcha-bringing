import dayjs, { Dayjs } from "dayjs";
import { BevDocumentType, DishDocumentType } from "../interfaces/interfaces.js";

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

// export function setTimeDayJs(time: string, dateObj: Dayjs) {
//   return dateObj
//     .set("hour", parseInt(time.slice(0, 1)))
//     .set("minute", parseInt(time.slice(3, 4)))
//     .set("second", 0);
// }

export function setTimeDayJs(newDateObj: Dayjs, timeObj: Dayjs) {
  return newDateObj
    .set("hour", timeObj.hour())
    .set("minute", timeObj.minute())
    .set("second", 0);
}

export function dateStringToDayJs(dateString: string) {
  const date = new Date(dateString);

  return dayjs(
    date.getFullYear() +
      "-" +
      date.getMonth() +
      "-" +
      date.getDate() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes()
  );
}

export function isOwned(
  itemId: string,
  userOwnedArray: string[] | undefined
): null | boolean {
  if (userOwnedArray === undefined) return null;
  return userOwnedArray.includes(itemId);
}

// function mustFind<T>(arr: Array<T>, predicate: (t: T) => boolean): T {
//   const item = arr.find(predicate);

//   if (!item) throw new Error("Item not found");

//   return item;
// }
