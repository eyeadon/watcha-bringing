import { useQuery } from "@tanstack/react-query";
import { UserDocumentType } from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

const apiClient = new APIClient<UserDocumentType>("/users");

const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: apiClient.getAll,
    staleTime: 0,
  });

export default useUsers;
