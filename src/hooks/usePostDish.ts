import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dish, DishDocumentType } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

interface PostDishContext {
  previousDishes: Dish[];
}

const usePostDish = () => {
  const queryClient = useQueryClient();
  const apiClientDish = new APIClient<Dish>("/dishes");

  // post Dish
  // mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
  // mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>
  // useMutation<data: get from backend, error, variables: data sent to backend, context>
  return useMutation<DishDocumentType, Error, Dish, PostDishContext>({
    mutationFn: (newDish: Dish) => {
      return apiClientDish.post(newDish);
    },
    onMutate: (newDish: Dish) => {
      // if undefined, return []
      const previousDishes = queryClient.getQueryData<Dish[]>(["dishes"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<Dish[]>(["dishes"], (dishes) => [
        newDish,
        ...(dishes || []),
      ]);

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

export default usePostDish;
