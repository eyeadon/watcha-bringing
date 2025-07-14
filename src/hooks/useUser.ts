import { useQuery } from "@tanstack/react-query";
import { UserDocumentType } from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

const apiClient = new APIClient<UserDocumentType>("/users");

const useUser = (publicId: string) =>
  useQuery({
    queryKey: ["user", publicId],
    queryFn: () => apiClient.getSingleByPublicId(publicId),
    staleTime: 0,
    enabled: !!publicId,
  });

export default useUser;
