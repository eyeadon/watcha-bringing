import { useQuery } from "@tanstack/react-query";
import { Event } from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

const apiClient = new APIClient<Event>("/events");

const useEvents = () =>
  useQuery({
    queryKey: ["events"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Dish>>("/dishes").then((res) => res.data),
    queryFn: apiClient.getAll,

    staleTime: 0,
    // dishes -> mongodb data
    // initialData: dishes,
  });

export default useEvents;
