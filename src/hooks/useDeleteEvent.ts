import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventDocumentType } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";
import { emptyEvent } from "../constants/constants";

interface DeleteEventContext {
  previousEvents: EventDocumentType[];
  previousSelectedEvent: EventDocumentType;
}

const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const apiClientEvent = new APIClient<EventDocumentType>("/events");

  // mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
  // mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>
  // useMutation<data: get from backend, error, variables: data sent to backend, context>
  return useMutation<EventDocumentType, Error, string, DeleteEventContext>({
    mutationFn: async (id) => {
      return await apiClientEvent.delete(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["events"] });

      // if undefined, return []
      const previousEvents =
        queryClient.getQueryData<EventDocumentType[]>(["events"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<EventDocumentType[]>(["events"], (events) => {
        if (events === undefined) return [];

        return events.filter((e) => e._id?.toString() !== id);
      });

      await queryClient.cancelQueries({ queryKey: ["selectedEvent"] });

      const previousSelectedEvent =
        queryClient.getQueryData<EventDocumentType>(["selectedEvent"]) ||
        emptyEvent;

      // queryClient.removeQueries({ queryKey: ["selectedEvent"] });

      queryClient.setQueryData<EventDocumentType>(
        ["selectedEvent"],
        emptyEvent
      );

      // can access in onError callback
      return { previousEvents, previousSelectedEvent };
    },
    // (data, variables, context)
    onSuccess: (mutationResult, id) => {
      return mutationResult;
    },
    //       (error, variables, context)
    // use context in case request fails
    onError: (error, id, context) => {
      if (!context) return;

      queryClient.setQueryData<EventDocumentType[]>(
        ["events"],
        context.previousEvents
      );
      queryClient.setQueryData<EventDocumentType>(
        ["selectedEvent"],
        context.previousSelectedEvent
      );
    },
    // (data, error, variables, context)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });
    },
  });
};

export default useDeleteEvent;
