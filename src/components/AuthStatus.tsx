import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const AuthStatus = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated)
    return (
      <div className="flex space-x-2 items-center">
        <h4>{user!.name}</h4>
        <LogoutButton />
      </div>
    );

  return <LoginButton />;
};

export default AuthStatus;
