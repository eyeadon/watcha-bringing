import { Dish, Event } from "../interfaces/interfaces";
import { useQuery, Query } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import ms from "ms";

const apiClient = new APIClient<Dish[]>("/events");

const useEventSubDoc = (id: string) =>
  useQuery({
    queryKey: ["selectedEvent", id],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Event>>("/events").then((res) => res.data),
    queryFn: () => apiClient.getSubDoc(id),

    staleTime: 0,
    // refetchInterval: ( query) => {return query}
  });

export default useEventSubDoc;
