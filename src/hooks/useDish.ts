import { Dish } from "../interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import ms from "ms";

const apiClient = new APIClient<Dish>("/dishes");

const useDish = (id: string) =>
  useQuery({
    queryKey: ["dish"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Dish>>("/dishes").then((res) => res.data),
    queryFn: () => apiClient.get(id),

    staleTime: 0,
    // dishes -> mongodb data
    // initialData: dishes,
  });

export default useDish;
