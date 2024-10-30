import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dish, DishDocumentType } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

interface DeleteDishContext {
  previousDishes: DishDocumentType[];
}

const useDeleteDish = () => {
  const queryClient = useQueryClient();
  const apiClientDish = new APIClient<DishDocumentType>("/dishes");

  // mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
  // mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>
  // useMutation<data: get from backend, error, variables: data sent to backend, context>
  return useMutation<DishDocumentType, Error, string, DeleteDishContext>({
    mutationFn: (id) => {
      return apiClientDish.delete(id);
    },
    onMutate: (id) => {
      // if undefined, return []
      const previousDishes =
        queryClient.getQueryData<DishDocumentType[]>(["dishes"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<DishDocumentType[]>(["dishes"], (dishes) => {
        if (dishes === undefined) return [];
        return dishes.filter((e) => e._id?.toString() !== id);
      });

      // can access in onError callback
      return { previousDishes };
    },
    // (data, variables, context)
    onSuccess: (mutationResult, id) => {
      return mutationResult;
    },
    //       (error, variables, context)
    // use context in case request fails
    onError: (error, id, context) => {
      if (!context) return;

      queryClient.setQueryData<DishDocumentType[]>(
        ["dishes"],
        context.previousDishes
      );
    },
  });
};

export default useDeleteDish;
