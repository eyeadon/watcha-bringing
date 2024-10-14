import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventDocumentType, Event } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

interface PostEventContext {
  previousEvents: Event[];
}

const usePostEvent = () => {
  const queryClient = useQueryClient();
  const apiClientEvent = new APIClient<Event>("/events");

  return useMutation<EventDocumentType, Error, Event, PostEventContext>({
    mutationFn: (newEvent: Event) => {
      return apiClientEvent.post(newEvent);
    },
    onMutate: (newEvent: Event) => {
      // if undefined, return []
      const previousEvents =
        queryClient.getQueryData<Event[]>(["events"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<Event[]>(["events"], (events) => [
        newEvent,
        ...(events || []),
      ]);

      // can access in onError callback
      return { previousEvents };
    },
    onSuccess: (savedEvent, newEvent: Event) => {
      //                              (queryKey, updater, options?)
      queryClient.setQueryData<Event[]>(["events"], (events) => {
        // replace newEvent instance set by onMutate with proper savedEvent
        events?.forEach((element) => {
          if (element.publicId === newEvent.publicId) element = savedEvent;
        });
        return events;
      });
    },
    //       (error, variables, context)
    // use context in case request fails
    onError: (error, newEvent, context) => {
      if (!context) return;

      queryClient.setQueryData<Event[]>(["events"], context.previousEvents);
    },
  });
};

export default usePostEvent;