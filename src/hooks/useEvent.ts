import { Event } from "../interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import ms from "ms";

const apiClient = new APIClient<Event>("/events");

const useEvent = (id: string) =>
  useQuery({
    queryKey: ["event"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Event>>("/Eventes").then((res) => res.data),
    queryFn: () => apiClient.get(id),

    staleTime: ms("24h"),
    // Eventes -> mongodb data
    // initialData: Eventes,
  });

export default useEvent;
