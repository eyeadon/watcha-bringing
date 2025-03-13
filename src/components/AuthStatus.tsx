import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { emptyUser } from "../constants/constants";
import useUserByEmail from "../hooks/useUserByEmail";
import { nanoid } from "nanoid";
import usePostUser from "../hooks/usePostUser";
import { User } from "../interfaces/interfaces";

const AuthStatus = () => {
  // access auth state
  const { user: auth0User, error: errorAuth, isAuthenticated } = useAuth0();

  const userEmail = auth0User?.email;

  // Dependent query, dependent on useUserByEmail parameter.
  // Check if user exists in mongoDB database, get by email.
  let { data: user, error: errorUser } = useUserByEmail(userEmail!);
  console.log(user);

  const { data, mutateAsync: postUserMutateAsync } = usePostUser();
  console.log(data);

  if (errorAuth) throw new Error("User not found");

  // if user not found, create new user (post), update user variable
  if (user?.publicId === "none") {
    console.log(user, "my if call");

    const publicId = nanoid();
    let newUserWithPublicId: User | null;

    const postNewUser = async function () {
      const userResult = await postUserMutateAsync(newUserWithPublicId!);
      console.log(userResult);
      // replace user with user from db with _id
      user = userResult;
    };

    auth0User !== undefined
      ? (newUserWithPublicId = {
          ...emptyUser,
          publicId: publicId,
          name: auth0User.name!,
          email: auth0User.email!,
        })
      : (newUserWithPublicId = null);

    if (newUserWithPublicId !== null) postNewUser();
  }

  if (errorUser) {
    return <p>Error: {errorUser.message}</p>;
  }

  if (isAuthenticated) {
    return (
      // TODO fix styles
      <div className="">
        <p style={{ color: "#999999", margin: 0 }}>{user?.name}</p>
        <LogoutButton />
      </div>
    );
  }

  // not logged in
  return <LoginButton />;
};

export default AuthStatus;
