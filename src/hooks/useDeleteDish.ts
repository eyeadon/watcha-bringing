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
      const previousDishes = queryClient.getQueryData<Dish[]>(["dishes"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<Dish[]>(["dishes"], (dishes) => {
        if (dishes === undefined) return [];
        return dishes.filter((e) => e._id !== id);
      });

      // can access in onError callback
      return { previousDishes };
    },
    onSuccess: (savedDish, newDish: Dish) => {
      //                              (queryKey, updater, options?)
      queryClient.setQueryData<Dish[]>(["dishes"], (dishes) => {
        // replace newDish instance set by onMutate with proper savedDish
        dishes?.forEach((element) => {
          if (element.publicId === newDish.publicId) element = savedDish;
        });
        return dishes;
      });
    },
    //       (error, variables, context)
    // use context in case request fails
    onError: (error, newDish, context) => {
      if (!context) return;

      queryClient.setQueryData<Dish[]>(["dishes"], context.previousDishes);
    },
  });
};

export default useDeleteDish;
