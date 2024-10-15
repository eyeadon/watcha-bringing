import {
  Dish,
  Bev,
  EventDocumentType,
  Event,
  DishDocumentType,
  BevDocumentType,
} from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

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

export function capitalizeFirstLetter(string: string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : null;
}

// if item is not a dish, typescript will know that it must be a bev
function isDish(
  item: DishDocumentType | BevDocumentType
): item is DishDocumentType {
  return (item as DishDocumentType).dietary !== undefined;
}

export async function addNewItemAndSyncWithEvent(
  newItem: Dish | Bev,
  newItemMutateFunc: (
    item: Dish | Bev
  ) => Promise<DishDocumentType | BevDocumentType>,
  apiClient: APIClient<DishDocumentType | BevDocumentType>,
  selectedEvent: EventDocumentType,
  putEventMutateFunc: (event: Event) => Promise<EventDocumentType>
) {
  const resultItemFromMutate = await newItemMutateFunc(newItem);

  console.log(resultItemFromMutate);

  // adding Item to event ********************************

  // get newly created _id for newItem
  const resultItem = await apiClient.getSingleByPublicId(newItem.publicId);

  console.log(resultItem);

  if (resultItem === undefined) throw new Error("resultItem is undefined");

  const resultItemId = resultItem._id?.toString();

  if (resultItemId === undefined) throw new Error("resultItemId is undefined");
  if (selectedEvent.dishes === undefined || selectedEvent.bevs === undefined)
    throw new Error("event items are undefined");

  // add newItem id to selectedEvent
  if (isDish(newItem)) {
    selectedEvent.publicId !== "none"
      ? selectedEvent.dishes.push(resultItemId)
      : new Error("no event selected");
  } else {
    selectedEvent.publicId !== "none"
      ? selectedEvent.bevs.push(resultItemId)
      : new Error("no event selected");
  }

  const selectedEventWithoutId = { ...selectedEvent };
  delete selectedEventWithoutId._id;

  const resultEventFromMutate = await putEventMutateFunc(
    selectedEventWithoutId
  );

  console.log(resultEventFromMutate);
}
