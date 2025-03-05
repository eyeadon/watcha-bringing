import { useQuery } from "@tanstack/react-query";
import { UserDocumentType } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

const apiClient = new APIClient<UserDocumentType>("/users");

const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: apiClient.getAll,
    staleTime: 0,
  });

export default useUsers;
