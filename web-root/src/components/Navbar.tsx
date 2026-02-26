import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/microfrontend", label: "Microfrontend" },
    { to: "/microfrontend2", label: "Microfrontend 2" },
    { to: "/microfrontend3", label: "Microfrontend 3" },
  ];

  return (
    <nav>
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className="btn-secondary"
              style={({ isActive }) => ({
                backgroundColor: isActive
                  ? "var(--color-primary)"
                  : "var(--color-secondary)",
              })}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
