import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DishDocumentType,
  EventDocumentType,
} from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

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
    { eventId: string; itemId: string; itemKind: string },
    DeleteDishContext
  >({
    mutationFn: async (obj) => {
      const deletedItemFromEvent = await apiClientEvent.deleteItem(
        obj.eventId,
        obj.itemId,
        obj.itemKind
      );
      console.log(deletedItemFromEvent);

      return await apiClientDish.delete(obj.itemId);
    },
    onMutate: (obj) => {
      // if undefined, return []
      const previousDishes =
        queryClient.getQueryData<DishDocumentType[]>(["dishes"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<DishDocumentType[]>(["dishes"], (dishes) => {
        if (dishes === undefined) return [];

        return dishes.filter((e) => e._id?.toString() !== obj.itemId);
      });

      // can access in onError callback
      return { previousDishes };
    },
    // (data, variables, context)
    onSuccess: (mutationResult) => {
      return mutationResult;
    },
    //       (error, variables, context)
    // use context in case request fails
    onError: (error, obj, context) => {
      if (error) {
        console.log(error);
        console.log(obj);
      }
      if (!context) return;

      queryClient.setQueryData<DishDocumentType[]>(
        ["dishes"],
        context.previousDishes
      );
    },
    // (data, error, variables, context)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });
    },
  });
};

export default useDeleteDish;
