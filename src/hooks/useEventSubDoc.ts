import { Event } from "../interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import ms from "ms";

const apiClient = new APIClient<Event>("/events");

const useEventSubDoc = (id: string) =>
  useQuery({
    queryKey: ["event"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Event>>("/Eventes").then((res) => res.data),
    queryFn: () => apiClient.getSubDoc(id),

    staleTime: ms("24h"),
    // Eventes -> mongodb data
    // initialData: Eventes,
  });

export default useEventSubDoc;
