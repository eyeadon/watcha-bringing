import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dish, DishDocumentType } from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

interface PutDishContext {
  previousDishes: DishDocumentType[];
}

const usePutDish = () => {
  const queryClient = useQueryClient();
  const apiClientDish = new APIClient<Dish>("/dishes");

  // mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
  // mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>
  // useMutation<data: get from backend, error, variables: data sent to backend, context>
  return useMutation<
    DishDocumentType,
    Error,
    { itemId: string; data: Dish },
    PutDishContext
  >({
    mutationFn: async (obj) => {
      return await apiClientDish.put(obj.itemId, obj.data);
    },
    onMutate: async (obj) => {
      await queryClient.cancelQueries({ queryKey: ["dishes"] });

      const previousDishes =
        queryClient.getQueryData<DishDocumentType[]>(["dishes"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<DishDocumentType[]>(["dishes"], (dishes) => {
        dishes?.forEach((element) => {
          if (element.publicId === obj.data.publicId) element = obj.data;
        });
        return dishes;
      });

      // can access in onError callback
      return { previousDishes };
    },
    // (data, variables, context)
    onSuccess: (savedDish) => {
      //                              (queryKey, updater, options?)
      queryClient.setQueryData<Dish[]>(["dishes"], (dishes) => {
        // replace obj instance set by onMutate with proper savedDish
        dishes?.forEach((element) => {
          if (element.publicId === savedDish.publicId) element = savedDish;
        });
        return dishes;
      });
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

export default usePutDish;
