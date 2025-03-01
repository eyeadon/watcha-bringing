import { MdHome } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import AuthStatus from "./AuthStatus";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const NavBar = () => {
  const links = [
    { label: "Events", href: "/events" },
    { label: "Admin", href: "/admin" },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Item>size=8</Item>
        </Grid>
        <Grid size={4}>
          <Item>size=4</Item>
        </Grid>
        <Item>
          <Link to="/">
            <MdHome size={24} color="#000" />
          </Link>
        </Item>
        <ul className="flex space-x-8 ml-10">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  isActive
                    ? "text-zinc-800"
                    : "text-zinc-700 hover:text-blue-500"
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <AuthStatus />
      </Grid>
    </Box>
  );
};

export default NavBar;
