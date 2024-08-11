import { Dish } from "../interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import ms from "ms";

const apiClient = new APIClient<Dish>("/dishes");

const useDishes = () =>
  useQuery({
    queryKey: ["dishes"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Dish>>("/dishes").then((res) => res.data),
    queryFn: apiClient.getAll,

    staleTime: ms("24h"),
    // dishes -> mongodb data
    // initialData: dishes,
  });

export default useDishes;
