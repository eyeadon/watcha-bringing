import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bev, BevDocumentType } from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

interface PostBevContext {
  previousBevs: Bev[];
}

const usePostBev = () => {
  const queryClient = useQueryClient();
  const apiClientBev = new APIClient<Bev>("/bevs");

  // post Bev
  // mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
  // mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>
  // useMutation<data: get from backend, error, variables: data sent to backend, context>
  return useMutation<BevDocumentType, Error, Bev, PostBevContext>({
    mutationFn: (newBev: Bev) => {
      return apiClientBev.post(newBev);
    },
    onMutate: (newBev: Bev) => {
      // if undefined, return []
      const previousBevs =
        queryClient.getQueryData<BevDocumentType[]>(["bevs"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<BevDocumentType[]>(["bevs"], (bevs) => [
        newBev,
        ...(bevs || []),
      ]);

      // can access in onError callback
      return { previousBevs };
    },
    onSuccess: (savedBev, newBev: Bev) => {
      //                              (queryKey, updater, options?)
      queryClient.setQueryData<BevDocumentType[]>(["bevs"], (bevs) => {
        // replace newBev instance set by onMutate with proper savedBev
        bevs?.forEach((element) => {
          if (element.publicId === newBev.publicId) element = savedBev;
        });
        return bevs;
      });
    },
    //       (error, variables, context)
    // use context in case request fails
    onError: (error, newBev, context) => {
      if (error) {
        console.log(error);
        console.log(newBev);
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

export default usePostBev;
