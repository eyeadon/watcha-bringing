import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, UserDocumentType } from "../interfaces/interfaces";
import APIClient from "../services/apiClient";
import { emptyUser } from "../constants/constants";

interface PutUserContext {
  previousUser: UserDocumentType;
}

const usePutUser = () => {
  const queryClient = useQueryClient();
  const apiClientUser = new APIClient<User>("/users");

  // mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void
  // mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>
  // useMutation<data: get from backend, error, variables: data sent to backend, context>
  return useMutation<
    UserDocumentType,
    Error,
    { itemId: string; data: User },
    PutUserContext
  >({
    mutationFn: async (obj) => {
      return await apiClientUser.put(obj.itemId, obj.data);
    },
    onMutate: async (obj) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });

      const previousUser =
        queryClient.getQueryData<UserDocumentType>(["user"]) || emptyUser;

      //                              (queryKey, updater, options?)
      queryClient.setQueryData<UserDocumentType>(["user"], obj.data);

      // can access in onError callback
      return { previousUser };
    },
    // (data, variables, context)
    onSuccess: (savedUser) => {
      //                              (queryKey, updater, options?)
      queryClient.setQueryData<User>(
        ["user"],
        // replace newUser instance set by onMutate with proper savedUser
        savedUser
      );
    },
    //       (error, variables, context)
    // use context in case request fails
    onError: (error, obj, context) => {
      if (error) {
        console.log(error);
        console.log(obj);
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

export default usePutUser;
