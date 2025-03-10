import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { emptyUser } from "../constants/constants";
import useUserByEmail from "../hooks/useUserByEmail";
import { nanoid } from "nanoid";

const AuthStatus = async () => {
  // access auth state
  let {
    user: auth0User,
    error,
    isLoading: isLoadingAuth,
    isAuthenticated,
  } = useAuth0();

  if (auth0User === undefined) auth0User = emptyUser;

  // check if user exists in mongoDB database, get by email
  // dependent query, dependent on useUser parameter
  let {
    data: user,
    error: errorUser,
    isLoading: isLoadingUser,
  } = useUserByEmail(auth0User.email!);

  if (error) throw new Error("User not found");

  // if user not found, create new user (post), update user variable
  if (errorUser) {
    const { mutateAsync: putUserMutateAsync } = usePutUser();
    const publicId = nanoid();

    const newUserWithPublicId = {
      ...emptyUser,
      publicId: publicId,
      name: auth0User.name,
      email: auth0User.email,
    };

    const result = await putUserMutateAsync(newUserWithPublicId);
    console.log(result);
    user = result;
  }

  if (isLoadingAuth) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    if (isLoadingUser) {
      return <div>Loading...</div>;
    }

    if (errorUser) {
      return <p>Error: {errorUser.message}</p>;
    }

    return (
      // TODO fix styles
      <div className="">
        <p style={{ color: "#999999", margin: 0 }}>{user!.name}</p>
        <LogoutButton />
      </div>
    );
  }

  return <LoginButton />;
};

export default AuthStatus;
function usePutUser(): { mutateAsync: any } {
  throw new Error("Function not implemented.");
}
