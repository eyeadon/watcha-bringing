import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
// import { emptyUser } from "../constants/constants";
// import useUserByEmail from "../hooks/useUserByEmail";
// import { nanoid } from "nanoid";
// import usePostUser from "../hooks/usePostUser";
// import { User } from "../interfaces/interfaces";
import LookUpUser from "./LookUpUser";

const AuthStatus = () => {
  // access auth state
  const { user: auth0User, error: errorAuth, isAuthenticated } = useAuth0();

  if (errorAuth) throw new Error("User not found");

  if (isAuthenticated) {
    return (
      <div>
        <p style={{ color: "#999999", margin: 0 }}>{auth0User?.name}</p>
        <LookUpUser userName={auth0User?.name} userEmail={auth0User?.email} />
        <LogoutButton />
      </div>
    );
  }

  // not logged in
  return <LoginButton />;
};

export default AuthStatus;
