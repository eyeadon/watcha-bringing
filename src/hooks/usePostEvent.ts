import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventDocumentType, Event } from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

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
      if (error) {
        console.log(error);
        console.log(newEvent);
      }
      if (!context) return;

      queryClient.setQueryData<Event[]>(["events"], context.previousEvents);
    },
    // (data, error, variables, context)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });
    },
  });
};

export default usePostEvent;
