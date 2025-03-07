import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { emptyUser } from "../constants/constants";
import useUserByEmail from "../hooks/useUserByEmail";

const AuthStatus = () => {
  // access auth state
  let { user: auth0User, isAuthenticated, isLoading } = useAuth0();

  // check if user exists in mongoDB database, get by email
  // dependent query, dependent on useUser parameter
  let {
    data: user,
    error: errorUser,
    isLoading: isLoadingUser,
  } = useUserByEmail(auth0User!.email);

  // if user not found -> if (error), create new user, post, return user
  // publicId: create publicId

  // if user found -> return user

  // actions in outside component
  // add event to user.eventsOwned, put
  // add dish to user.dishesOwned, put

  if (isLoading) {
    // auth0User = auth0User ?? emptyUser;
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    // so we can add our own user data, events/dishes owned:

    if (isLoadingUser) {
      // return <p>Loading...</p>;
      user = user ?? emptyUser;
    }

    if (errorUser) {
      return <p>Error: {errorUser.message}</p>;
    }

    return (
      // TODO fix styles
      <div className="">
        <p style={{ color: "#999999", margin: 0 }}>{auth0User!.name}</p>
        <LogoutButton />
      </div>
    );
  }

  return <LoginButton />;
};

export default AuthStatus;
