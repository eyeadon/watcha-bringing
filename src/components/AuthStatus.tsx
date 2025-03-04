import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const AuthStatus = () => {
  // access auth state
  const { user: auth0User, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    // so we can add our own user data, events/dishes owned:
    // check if user exists in App database, get
    // in server route: const user = await User.findById(req.params.id);
    // if user not found -> if (error), create new user, post, return user
    // if user found -> return user
    // add event to user.eventsOwned
    // add dish to user.dishesOwned

    // can we just use put?

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
