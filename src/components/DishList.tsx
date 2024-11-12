import {
  Dish,
  DishDocumentType,
  Event,
  EventDocumentType,
} from "../interfaces/interfaces";
import {
  capitalizeFirstLetter,
  visibleItemsFilterHelper,
} from "../functions/functions";
import useEventSubDoc from "../hooks/useEventSubDoc";
import APIClient from "../services/apiClient";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useDeleteDish from "../hooks/useDeleteDish";
import usePutDish from "../hooks/usePutDish";

interface Props {
  selectedEvent: EventDocumentType;
  selectedDishCategory: string;
}

const DishList = ({ selectedEvent, selectedDishCategory }: Props) => {
  if (selectedEvent.dishes === undefined) return null;

  const {
    data: putDishData,
    error: putDishError,
    isError: putDishIsError,
    isPending: putDishIsPending,
    isSuccess: putDishIsSuccess,
    mutate: putDishMutate,
    mutateAsync: putDishMutateAsync,
    reset: putDishReset,
    status: putDishStatus,
  } = usePutDish();

  const {
    data: deleteDishData,
    error: deleteDishError,
    isError: deleteDishIsError,
    isPending: deleteDishIsPending,
    isSuccess: deleteDishIsSuccess,
    mutate: deleteDishMutate,
    mutateAsync: deleteDishMutateAsync,
    reset: deleteDishReset,
    status: deleteDishStatus,
  } = useDeleteDish();

  const queryClient = useQueryClient();
  // queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });

  // get array of full dish objects from selectedEvent by using its publicId
  // returns UseQueryResult
  const { data, isLoading, status, refetch, error } = useEventSubDoc(
    selectedEvent.publicId,
    "dish"
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // console.log(data);

  const eventDishes = visibleItemsFilterHelper(
    // dishes,
    data,
    selectedDishCategory,
    "All Dish Categories"
  );

  // refetch();
  // console.log("DishList run");
  // console.log(eventDishes);

  return (
    <table className="table table-bordered" key="dishTable">
      <thead>
        <tr>
          <th>Category</th>
          <th>Name</th>
          <th>Amount</th>
          <th>Dietary</th>
          <th></th>
        </tr>
      </thead>
      <tbody key="dishTableBody">
        {/* {status === "success" && */}
        {eventDishes.map((dish: DishDocumentType) => (
          <tr key={dish.publicId}>
            <td>{capitalizeFirstLetter(dish.category)}</td>
            <td>{capitalizeFirstLetter(dish.name)}</td>
            <td>{dish.amount}</td>
            <td>
              {dish.dietary?.map((diet, index, arr) => {
                // last item has no comma after it
                return index === arr.length - 1 ? diet : `${diet}, `;
              })}
            </td>
            <td>
              <button
                className="btn btn-outline-primary btn-sm me-2 mb-2"
                onClick={async () => {
                  if (dish._id === undefined)
                    throw new Error("dish._id is undefined");

                  const dishWithoutId = { ...dish };
                  delete dishWithoutId._id;

                  const result = await putDishMutateAsync({
                    itemId: dish._id.toString(),
                    data: dishWithoutId,
                  });
                  console.log(result);
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-outline-danger btn-sm mb-2"
                onClick={async () => {
                  if (selectedEvent._id === undefined)
                    throw new Error("selectedEvent._id is undefined");
                  if (dish._id === undefined)
                    throw new Error("dish._id is undefined");

                  const result = await deleteDishMutateAsync({
                    eventId: selectedEvent._id.toString(),
                    itemId: dish._id.toString(),
                    itemKind: "dish",
                  });
                  console.log(result);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      {/* <tfoot>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tfoot> */}
    </table>
  );
};

export default DishList;
