import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BevDocumentType,
  EventDocumentType,
} from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

interface DeleteBevContext {
  previousBevs: BevDocumentType[];
}

const useDeleteBev = () => {
  const queryClient = useQueryClient();
  const apiClientBev = new APIClient<BevDocumentType>("/bevs");
  const apiClientEvent = new APIClient<EventDocumentType>("/events");

  // mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
  // mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>
  // useMutation<data: get from backend, error, variables: data sent to backend, context>
  return useMutation<
    BevDocumentType,
    Error,
    { eventId: string; itemId: string; itemKind: string },
    DeleteBevContext
  >({
    mutationFn: async (obj) => {
      const deletedItemFromEvent = await apiClientEvent.deleteItem(
        obj.eventId,
        obj.itemId,
        obj.itemKind
      );
      console.log(deletedItemFromEvent);

      return await apiClientBev.delete(obj.itemId);
    },
    onMutate: (obj) => {
      // if undefined, return []
      const previousBevs =
        queryClient.getQueryData<BevDocumentType[]>(["bevs"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<BevDocumentType[]>(["bevs"], (bevs) => {
        if (bevs === undefined) return [];

        return bevs.filter((e) => e._id?.toString() !== obj.itemId);
      });

      // can access in onError callback
      return { previousBevs };
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

export default useDeleteBev;
