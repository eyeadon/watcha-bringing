import { Dish, DishDocumentType, Event } from "../interfaces/interfaces";
import { useQuery, Query } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import ms from "ms";

const apiClient = new APIClient<DishDocumentType[]>("/events");

const useEventSubDoc = (id: string, itemKind: string) =>
  useQuery({
    queryKey: ["selectedEvent", id, itemKind],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Event>>("/events").then((res) => res.data),
    queryFn: () => apiClient.getSubDoc(id, itemKind),

    staleTime: 0,
    // refetchInterval: ( query) => {return query}
  });

export default useEventSubDoc;
