import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, UserDocumentType } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";

interface PostUserContext {
  previousUsers: User[];
}

const usePostUser = () => {
  const queryClient = useQueryClient();
  const apiClientUser = new APIClient<User>("/users");

  // post User
  // mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
  // mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>
  // useMutation<data: get from backend, error, variables: data sent to backend, context>
  return useMutation<UserDocumentType, Error, User, PostUserContext>({
    mutationFn: (newUser: User) => {
      return apiClientUser.post(newUser);
    },
    onMutate: (newUser: User) => {
      // if undefined, return []
      const previousUsers =
        queryClient.getQueryData<UserDocumentType[]>(["users"]) || [];

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<UserDocumentType[]>(["users"], (users) => [
        newUser,
        ...(users || []),
      ]);

      // can access in onError callback
      return { previousUsers };
    },
    onSuccess: (savedUser, newUser: User) => {
      //                              (queryKey, updater, options?)
      queryClient.setQueryData<UserDocumentType[]>(["users"], (users) => {
        // replace newUser instance set by onMutate with proper savedUser
        users?.forEach((element) => {
          if (element.publicId === newUser.publicId) element = savedUser;
        });
        return users;
      });
    },
    //       (error, variables, context)
    // use context in case request fails
    onError: (error, newUser, context) => {
      if (error) {
        console.log(error);
        console.log(newUser);
      }
      if (!context) return;

      queryClient.setQueryData<UserDocumentType[]>(
        ["users"],
        context.previousUsers
      );
    },
    // (data, error, variables, context)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });
    },
  });
};

export default usePostUser;
