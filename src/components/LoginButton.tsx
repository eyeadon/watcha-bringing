import { useAuth0 } from "@auth0/auth0-react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const BoldButton = styled(Button)({
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#2d363c",
    },
  });

  return <BoldButton onClick={() => loginWithRedirect()}>Log In</BoldButton>;
};

export default LoginButton;
