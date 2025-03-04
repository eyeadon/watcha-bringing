import AuthStatus from "./AuthStatus";
import { Link } from "react-router";

const NavBar = () => {
  return (
    <nav
      className="navbar bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Watcha Bringing?
        </Link>
        <span className="navbar-text">
          <AuthStatus />
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
