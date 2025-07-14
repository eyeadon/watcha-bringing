import { useQuery } from "@tanstack/react-query";
import { DishDocumentType } from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

const apiClient = new APIClient<DishDocumentType>("/dishes");

const useDishes = () =>
  useQuery({
    queryKey: ["dishes"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Dish>>("/dishes").then((res) => res.data),
    queryFn: apiClient.getAll,

    staleTime: 0,
    // dishes -> mongodb data
    // initialData: dishes,
  });

export default useDishes;
