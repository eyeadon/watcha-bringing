import { useQuery } from "@tanstack/react-query";
import { Event } from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

const apiClient = new APIClient<Event>("/events");

const useEvent = (id: string) =>
  useQuery({
    queryKey: ["event"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Event>>("/Eventes").then((res) => res.data),
    queryFn: () => apiClient.get(id),

    staleTime: 0,
    // Eventes -> mongodb data
    // initialData: Eventes,
  });

export default useEvent;
