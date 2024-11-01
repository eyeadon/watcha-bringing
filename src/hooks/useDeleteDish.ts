import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dish,
  DishDocumentType,
  EventDocumentType,
} from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

interface DeleteDishContext {
  previousDishes: DishDocumentType[];
}

const useDeleteDish = () => {
  const queryClient = useQueryClient();
  const apiClientDish = new APIClient<DishDocumentType>("/dishes");
  const apiClientEvent = new APIClient<EventDocumentType>("/events");

  // mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
  // mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>
  // useMutation<data: get from backend, error, variables: data sent to backend, context>
  return useMutation<
    DishDocumentType,
    Error,
    { eventId: string; dishId: string },
    DeleteDishContext
  >({
    mutationFn: async (obj) => {
      const deletedItemFromEvent = await apiClientEvent.deleteItem(
        obj.eventId,
        obj.dishId
      );
      console.log(deletedItemFromEvent);

      return await apiClientDish.delete(obj.dishId);
    },
    onMutate: (obj) => {
      // if undefined, return []
      const previousDishes =
        queryClient.getQueryData<DishDocumentType[]>(["dishes"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<DishDocumentType[]>(["dishes"], (dishes) => {
        if (dishes === undefined) return [];
        return dishes.filter((e) => e._id?.toString() !== obj.dishId);
      });

      // can access in onError callback
      return { previousDishes };
    },
    // (data, variables, context)
    onSuccess: (mutationResult, obj) => {
      return mutationResult;
    },
    //       (error, variables, context)
    // use context in case request fails
    onError: (error, obj, context) => {
      if (!context) return;

      queryClient.setQueryData<DishDocumentType[]>(
        ["dishes"],
        context.previousDishes
      );
    },
  });
};

export default useDeleteDish;
