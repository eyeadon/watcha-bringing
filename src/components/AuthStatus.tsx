import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const AuthStatus = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated)
    return (
      // TODO fix styles
      <div className="">
        <h4 style={{ color: "black", marginBottom: "0" }}>{user!.name}</h4>
        <LogoutButton />
      </div>
    );

  return <LoginButton />;
};

export default AuthStatus;
