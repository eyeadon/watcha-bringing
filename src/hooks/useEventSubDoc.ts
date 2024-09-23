import { Dish, Event } from "../interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import ms from "ms";

const apiClient = new APIClient<Dish[]>("/events");

const useEventSubDoc = (id: string) =>
  useQuery({
    queryKey: ["event"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Event>>("/events").then((res) => res.data),
    queryFn: () => apiClient.getSubDoc(id),

    staleTime: ms("24h"),
    // events -> mongodb data
    // initialData: events,
  });

export default useEventSubDoc;
