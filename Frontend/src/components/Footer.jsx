import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Footer = () => {
  const user = useSelector((store) => store.user);

  const links = user
    ? [
        { to: "/feed", label: "Discover" },
        { to: "/connections", label: "Connections" },
        { to: "/requests", label: "Requests" },
        { to: "/profile", label: "Profile" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/login", label: "Sign In" },
        { to: "/forgot-password", label: "Reset Password" },
      ];

  return (
    <footer className="border-t border-[var(--app-line)] bg-white/70">
      <div className="app-shell py-6">
        <div className="flex flex-col gap-4 text-sm text-[var(--app-muted)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-[var(--app-text)]">DevTinder</p>
            <p className="mt-1">
              Copyright © {new Date().getFullYear()} Nagabhushan Tirth.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition hover:text-[var(--app-text)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
