import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bev, BevDocumentType } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

interface PutBevContext {
  previousBevs: BevDocumentType[];
}

const usePutBev = () => {
  const queryClient = useQueryClient();
  const apiClientBev = new APIClient<Bev>("/bevs");

  // mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
  // mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>
  // useMutation<data: get from backend, error, variables: data sent to backend, context>
  return useMutation<
    BevDocumentType,
    Error,
    { itemId: string; data: Bev },
    PutBevContext
  >({
    mutationFn: async (obj) => {
      return await apiClientBev.put(obj.itemId, obj.data);
    },
    onMutate: async (obj) => {
      await queryClient.cancelQueries({ queryKey: ["bevs"] });

      const previousBevs =
        queryClient.getQueryData<BevDocumentType[]>(["bevs"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<BevDocumentType[]>(["bevs"], (bevs) => {
        bevs?.forEach((element) => {
          if (element.publicId === obj.data.publicId) element = obj.data;
        });
        return bevs;
      });

      // can access in onError callback
      return { previousBevs };
    },
    // (data, variables, context)
    onSuccess: (savedBev) => {
      //                              (queryKey, updater, options?)
      queryClient.setQueryData<Bev[]>(["bevs"], (bevs) => {
        // replace obj instance set by onMutate with proper savedBev
        bevs?.forEach((element) => {
          if (element.publicId === savedBev.publicId) element = savedBev;
        });
        return bevs;
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

      queryClient.setQueryData<BevDocumentType[]>(
        ["bevs"],
        context.previousBevs
      );
    },
    // (data, error, variables, context)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bevs"] });
      queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });
    },
  });
};

export default usePutBev;
