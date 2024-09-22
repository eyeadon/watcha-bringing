import { Dish } from "../interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import ms from "ms";

const apiClient = new APIClient<Dish>("/dishes");

const useDishSubDoc = (id: string) =>
  useQuery({
    queryKey: ["dish"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Dish>>("/dishes").then((res) => res.data),
    queryFn: () => apiClient.getSubDoc(id),

    staleTime: ms("24h"),
    // dishes -> mongodb data
    // initialData: dishes,
  });

export default useDishSubDoc;
