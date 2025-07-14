import { useQuery } from "@tanstack/react-query";
import { UserDocumentType } from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

const apiClient = new APIClient<UserDocumentType>("/users");

const useUserByEmail = (email: string) => {
  // console.log(email);
  return useQuery({
    queryKey: ["user", email],
    queryFn: () => apiClient.getSingleByEmail(email),
    staleTime: 0,
    enabled: !!email,
  });
};

export default useUserByEmail;
