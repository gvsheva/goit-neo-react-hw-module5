import { NavLink } from "react-router";
import css from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={css.navbar}>
      <ul className={css.navList}>
        <li className={css.navItem}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? css.active : "")}
            end
          >
            Home
          </NavLink>
        </li>
        <li className={css.navItem}>
          <NavLink
            to="/movies"
            className={({ isActive }) => (isActive ? css.active : "")}
          >
            Movies
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
