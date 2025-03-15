import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import useUserByEmail from "../hooks/useUserByEmail";
import usePostUser from "../hooks/usePostUser";
import { User } from "../interfaces/interfaces";
import { nanoid } from "nanoid";
import { emptyUser } from "../constants/constants";
import { Button } from "@mui/material";

const AuthStatus = () => {
  // access auth state
  const { user: auth0User, error: errorAuth, isAuthenticated } = useAuth0();

  // Dependent query, dependent on useUserByEmail parameter.
  // Check if user exists in mongoDB database, get by email.
  let { data: user, error: errorUser } = useUserByEmail(auth0User?.email!);
  console.log(user);

  const { mutateAsync: postUserMutateAsync } = usePostUser();

  const postUser = async (newUser: User) => {
    const userResult = await postUserMutateAsync(newUser);
    console.log(userResult);
    // replace current user with user from db with _id
    user = userResult;
  };

  const saveUser = async () => {
    // if user not found and user is authenticated,
    // create new user (post), update current user with db result user
    if (user?.publicId === "none") {
      console.log(user, "my if call");

      let newUserWithPublicId: User;
      const publicId = nanoid();

      newUserWithPublicId = {
        ...emptyUser,
        publicId: publicId,
        name: auth0User?.name!,
        email: auth0User?.email!,
      };

      await postUser(newUserWithPublicId);
    }
  };

  if (errorAuth) throw new Error("User not found");

  if (errorUser) {
    return <p>Error: {errorUser.message}</p>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <Button onClick={() => saveUser()}>Save User</Button>
        <p style={{ color: "#999999", margin: 0 }}>{auth0User?.name}</p>
        <LogoutButton />
      </div>
    );
  }

  // not logged in
  return <LoginButton />;
};

export default AuthStatus;
