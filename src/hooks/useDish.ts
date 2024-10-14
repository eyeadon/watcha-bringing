import { Dish, DishDocumentType } from "../interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import ms from "ms";

const apiClient = new APIClient<DishDocumentType>("/dishes");

const useDish = (publicId: string) =>
  useQuery({
    queryKey: ["dish", publicId],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Dish>>("/dishes").then((res) => res.data),
    queryFn: () => apiClient.getSingleByPublicId(publicId),

    staleTime: 0,
  });

export default useDish;
