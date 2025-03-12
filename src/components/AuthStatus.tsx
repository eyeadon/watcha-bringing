import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { emptyUser } from "../constants/constants";
import useUserByEmail from "../hooks/useUserByEmail";
import { nanoid } from "nanoid";
import usePostUser from "../hooks/usePostUser";

const AuthStatus = () => {
  // access auth state
  const { user: auth0User, error: errorAuth, isAuthenticated } = useAuth0();

  const userEmail = auth0User?.email ?? "";

  // Dependent query, dependent on useUser parameter.
  // Check if user exists in mongoDB database, get by email.
  let { data: user, error: errorUser } = useUserByEmail(userEmail);

  const { mutateAsync: postUserMutateAsync } = usePostUser();

  if (errorAuth) throw new Error("User not found");

  // if (auth0User === undefined) return <LoginButton />;
  // if (user === undefined) return <LoginButton />;

  // if user not found, create new user (post), update user variable
  if (user?.publicId === "none") {
    const publicId = nanoid();
    let newUserWithPublicId;

    if (auth0User === undefined) newUserWithPublicId = emptyUser;
    else
      newUserWithPublicId = {
        ...emptyUser,
        publicId: publicId,
        name: auth0User.name!,
        email: auth0User.email!,
      };

    (async function () {
      const userResult = await postUserMutateAsync(newUserWithPublicId);
      console.log(userResult);
      user = userResult;
    })();
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
