import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventDocumentType, Event } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

interface PutEventContext {
  previousEvents: Event[];
}

const usePutEvent = (selectedEvent: EventDocumentType) => {
  const queryClient = useQueryClient();
  const apiClientEvent = new APIClient<Event>("/events");

  return useMutation<EventDocumentType, Error, Event, PutEventContext>({
    mutationFn: (eventToUpdate: Event) => {
      if (selectedEvent._id === undefined)
        throw new Error("selectedEvent._id is undefined");

      return apiClientEvent.put(selectedEvent._id.toString(), eventToUpdate);
    },
    onMutate: (eventToUpdate: Event) => {
      // queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });

      // if undefined, return []
      const previousEvents =
        queryClient.getQueryData<Event[]>(["events"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<Event[]>(["events"], (events) => {
        events?.forEach((element) => {
          if (element.publicId === eventToUpdate.publicId)
            element = eventToUpdate;
        });
        return events;
      });

      // can access in onError callback
      return { previousEvents };
    },
    onSuccess: (savedEvent, eventToUpdate: Event) => {
      //                              (queryKey, updater, options?)
      queryClient.setQueryData<Event[]>(["events"], (events) => {
        // replace eventToUpdate instance set by onMutate with proper savedEvent
        events?.forEach((element) => {
          if (element.publicId === eventToUpdate.publicId) element = savedEvent;
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
    // (data, error, variables, context)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });
    },
  });
};

export default usePutEvent;
