import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, UserDocumentType } from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";
import { emptyUser } from "../constants/constants.js";

interface PostUserContext {
  previousUser: User;
}

const usePostUser = () => {
  const queryClient = useQueryClient();
  const apiClientUser = new APIClient<User>("/users");

  // post User
  // mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
  // mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>
  // useMutation<data: get from backend, error, variables: data sent to backend, context -> interface created above >
  return useMutation<UserDocumentType, Error, User, PostUserContext>({
    mutationFn: (newUser: User) => {
      console.log(newUser);
      // return user
      return apiClientUser.post(newUser);
    },
    onMutate: (newUser: User) => {
      const previousUser =
        queryClient.getQueryData<UserDocumentType>(["user"]) || emptyUser;

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<UserDocumentType>(["user"], newUser);

      // can access in onError callback
      return { previousUser };
    },
    // onSuccess: (data: TData, variables: TVariables, context: TContext) => Promise<unknown> | unknown
    onSuccess: (savedUser) => {
      //                              (queryKey, updater, options?)
      queryClient.setQueryData<UserDocumentType>(
        ["user"],
        // replace newUser instance set by onMutate with proper savedUser
        savedUser
      );
    },
    //       (error, variables, context)
    // use context in case request fails
    onError: (error, newUser, context) => {
      if (error) {
        console.log(error);
        console.log(newUser);
      }
      if (!context) return;

      queryClient.setQueryData<UserDocumentType>(
        ["user"],
        context.previousUser
      );
    },
    // (data, error, variables, context)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });
    },
  });
};

export default usePostUser;
