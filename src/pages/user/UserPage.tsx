import { withAuthenticationRequired } from "@auth0/auth0-react";

export const UserPage = withAuthenticationRequired(() => {
  return (
    <div>
      <h1>User Home</h1>
    </div>
  );
});
