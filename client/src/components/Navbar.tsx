import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-tempo.png";

const navItems = [
  { label: "HOME", path: "/home" },
  { label: "STATS", path: "/stats" },
  { label: "TOTEM", path: "/totem" },
  { label: "PROFILE", path: "/profile" },
];

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <header className="py-6">
      <nav className="max-w-5xl mx-auto flex items-center gap-8">
        <Link to="/home" className="flex-shrink-0 mr-8">
          <img src={logo} alt="Tempo Logo" style={{ height: 48 }} />
        </Link>
        <div className="flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-lg font-medium transition-colors duration-200
                ${
                  location.pathname === item.path
                    ? "text-spotify-green font-bold"
                    : "text-white hover:text-spotify-green"
                }
              `}
              style={{ textDecoration: "none" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
