import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import useUserByEmail from "../hooks/useUserByEmail";
import usePostUser from "../hooks/usePostUser";
import { User, UserDocumentType } from "../interfaces/interfaces";
import { nanoid } from "nanoid";
import { emptyUser } from "../constants/constants";
import { Button } from "@mui/material";
import { useCallback, useEffect } from "react";

const AuthStatus = () => {
  // access auth state
  const { user: auth0User, error: errorAuth, isAuthenticated } = useAuth0();

  // Dependent query, dependent on useUserByEmail parameter.
  // Check if user exists in mongoDB database, get by email.
  const { data: user, error: errorUser } = useUserByEmail(auth0User?.email!);
  console.log(user);

  let newUserResult: UserDocumentType = emptyUser;

  const { mutateAsync: postUserMutateAsync } = usePostUser();

  const postUser = useCallback(async () => {
    console.log("postUser run initially");

    // if user not found and user is authenticated,
    // create new user (post)
    if (user?.publicId === "none") {
      console.log(user, "my if call");

      const publicId = nanoid();

      const newUserWithPublicId = {
        ...emptyUser,
        publicId: publicId,
        name: auth0User?.name!,
        email: auth0User?.email!,
      };

      newUserResult = await postUserMutateAsync(newUserWithPublicId);
      console.log(newUserResult);
      // TODO share newUserResult if _id needed
    }
  }, [user, newUserResult]);

  useEffect(() => {
    postUser();
  }, [postUser]);

  if (errorAuth) throw new Error("User not found");

  if (errorUser) {
    return <p>Error: {errorUser.message}</p>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <p style={{ color: "#999999", margin: 0 }}>{auth0User?.name}</p>
        {/* <Button onClick={() => postUser()}>Save User</Button> */}
        <LogoutButton />
      </div>
    );
  }

  // not logged in
  return <LoginButton />;
};

export default AuthStatus;
