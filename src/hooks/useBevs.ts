import { useQuery } from "@tanstack/react-query";
import { Bev } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

const apiClient = new APIClient<Bev>("/bevs");

const useBevs = () =>
  useQuery({
    queryKey: ["bevs"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Dish>>("/dishes").then((res) => res.data),
    queryFn: apiClient.getAll,

    staleTime: 0,
    // dishes -> mongodb data
    // initialData: dishes,
  });

export default useBevs;
