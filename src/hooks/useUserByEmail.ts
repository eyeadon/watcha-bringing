import { useQuery } from "@tanstack/react-query";
import { UserDocumentType } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

const apiClient = new APIClient<UserDocumentType>("/users");

const useUserByEmail = (email: string) =>
  useQuery({
    queryKey: ["user", email],
    queryFn: () => apiClient.getSingleByEmail(email),
    staleTime: 0,
    enabled: !!email,
  });

export default useUserByEmail;
