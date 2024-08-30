import { Bev } from "../interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import ms from "ms";

const apiClient = new APIClient<Bev>("/bevs");

const useBevs = () =>
  useQuery({
    queryKey: ["bevs"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Dish>>("/dishes").then((res) => res.data),
    queryFn: apiClient.getAll,

    staleTime: ms("24h"),
    // dishes -> mongodb data
    // initialData: dishes,
  });

export default useBevs;
