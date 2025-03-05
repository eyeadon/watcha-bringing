import { useQuery } from "@tanstack/react-query";
import { UserDocumentType } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

const apiClient = new APIClient<UserDocumentType>("/users");

const useUser = (publicId: string) =>
  useQuery({
    queryKey: ["user", publicId],
    queryFn: () => apiClient.getSingleByPublicId(publicId),
    staleTime: 0,
  });

export default useUser;
