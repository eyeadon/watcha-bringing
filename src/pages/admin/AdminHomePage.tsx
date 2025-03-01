import { withAuthenticationRequired } from "@auth0/auth0-react";

const AdminHomePage = withAuthenticationRequired(() => {
  return (
    <div>
      <h1>Admin Area</h1>
    </div>
  );
});

export default AdminHomePage;
