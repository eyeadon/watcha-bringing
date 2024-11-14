import { useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import {
  capitalizeFirstLetter,
  visibleItemsFilterHelper,
} from "../functions/functions";
import useDeleteDish from "../hooks/useDeleteDish";
import useEventSubDoc from "../hooks/useEventSubDoc";
import { DishDocumentType, EventDocumentType } from "../interfaces/interfaces";
import EditDishForm from "./EditDishForm";

interface Props {
  selectedEvent: EventDocumentType;
  selectedDishCategory: string;
}

const DishList = ({ selectedEvent, selectedDishCategory }: Props) => {
  if (selectedEvent.dishes === undefined) return null;

  const [editItemDisplay, setEditItemDisplay] = useState(false);

  // const [isExpanded, setIsExpanded] = useState(false);
  // const showChild = isExpanded ? children : null;

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
  const { data, isLoading, isSuccess, status, refetch, error } = useEventSubDoc(
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
    <>
      <div className="container border border-2 border-primary-subtle">
        <div className="row" key="header">
          <div className="col-sm p-2 border border-primary-subtle bg-primary-subtle">
            <strong>Chef</strong>
          </div>
          <div className="col-sm p-2 border border-primary-subtle">
            <strong>Category</strong>
          </div>
          <div className="col-sm p-2 border border-primary-subtle">
            <strong>Name</strong>
          </div>
          <div className="col-sm p-2 border border-primary-subtle">
            <strong>Amount</strong>
          </div>
          <div className="col-sm p-2 border border-primary-subtle">
            <strong>Dietary</strong>
          </div>
          <div className="col-sm p-2 border border-primary-subtle">&nbsp;</div>
        </div>
        {eventDishes.map((dish: DishDocumentType) => (
          <div className="row" key={dish.publicId}>
            <div className="col-sm p-2 border border-primary-subtle">
              {capitalizeFirstLetter(dish.userName)}
            </div>
            <div className="col-sm p-2 border border-primary-subtle">
              {capitalizeFirstLetter(dish.category)}
            </div>
            <div className="col-sm p-2 border border-primary-subtle">
              {capitalizeFirstLetter(dish.name)}
            </div>
            <div className="col-sm p-2 border border-primary-subtle">
              {dish.amount}
            </div>
            <div className="col-sm p-2 border border-primary-subtle">
              {dish.dietary?.map((diet, index, arr) => {
                // last item has no comma after it
                return index === arr.length - 1 ? diet : `${diet}, `;
              })}
            </div>
            <div className="col-sm p-2 border border-primary-subtle">
              <button
                className="btn btn-outline-primary btn-sm me-2 mb-2"
                onClick={() => {
                  // make EditDishForm appear
                  setEditItemDisplay(!editItemDisplay);
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
            </div>
            {editItemDisplay && (
              <EditDishForm dish={dish} editItemDisplay={editItemDisplay} />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default DishList;
