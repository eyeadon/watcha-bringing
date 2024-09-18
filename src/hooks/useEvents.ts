import { Event } from "../interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import ms from "ms";

const apiClient = new APIClient<Event>("/events");

const useEvents = () =>
  useQuery({
    queryKey: ["events"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Dish>>("/dishes").then((res) => res.data),
    queryFn: apiClient.getAll,

    staleTime: ms("24h"),
    // dishes -> mongodb data
    // initialData: dishes,
  });

export default useEvents;
