import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiClock,
  FiCompass,
  FiLink2,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { BASE_URL, getPhotoUrl } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { toast } from "react-toastify";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Discover", icon: FiCompass },
    { to: "/connections", label: "Connections", icon: FiLink2 },
    { to: "/requests", label: "Requests", icon: FiClock },
    { to: "/profile", label: "Profile", icon: FiUser },
  ];

  const currentPage =
    navItems.find(({ to }) => to === location.pathname)?.label || "Discover";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--app-line)] bg-[color:rgba(255,247,240,0.82)] backdrop-blur-xl">
      <div className="app-shell py-3">
        <div className="nav-shell px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[var(--app-line)] bg-[color:rgba(255,255,255,0.82)] text-sm font-bold text-[var(--app-accent-strong)] shadow-sm">
                DT
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-[var(--app-text)]">
                  DevTinder
                </p>
                <p className="hidden text-xs text-[var(--app-muted)] sm:block">
                  Simple developer connections
                </p>
              </div>
            </Link>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {user ? (
                <>
                  <div className="hidden items-center gap-2 rounded-full border border-[var(--app-line)] bg-[var(--app-accent-soft)] px-3 py-2 sm:inline-flex">
                    <span className="h-2 w-2 rounded-full bg-[var(--app-accent)]"></span>
                    <span className="text-sm font-medium text-[var(--app-muted)]">
                      {currentPage}
                    </span>
                  </div>

                  <div ref={menuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen((open) => !open)}
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                      className="inline-flex items-center gap-3 rounded-2xl border border-[var(--app-line)] bg-[color:rgba(255,255,255,0.72)] px-2 py-2 text-left shadow-sm transition hover:border-[color:rgba(230,126,47,0.28)] hover:bg-[color:rgba(255,255,255,0.9)]"
                    >
                      <div className="app-avatar-ring h-11 w-11 rounded-2xl border-[color:rgba(230,126,47,0.16)] bg-[var(--app-surface-muted)]">
                        <img
                          alt="user-photo"
                          src={getPhotoUrl(user.photoUrl)}
                          className="app-image-cover"
                        />
                      </div>
                      <div className="hidden min-w-0 sm:block">
                        <p className="max-w-[9rem] truncate text-sm font-semibold text-[var(--app-text)]">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-[var(--app-muted)]">
                          Open menu
                        </p>
                      </div>
                      <FiChevronDown
                        size={16}
                        className={`text-[var(--app-muted)] transition ${
                          isMenuOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    <div
                      className={`surface-card absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(18rem,calc(100vw-1rem))] p-3 text-sm shadow-xl transition duration-150 ${
                        isMenuOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-2 opacity-0"
                      }`}
                    >
                      <div className="surface-card-soft px-3 py-3">
                        <p className="text-sm font-semibold text-[var(--app-text)]">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="mt-1 text-xs text-[var(--app-muted)]">
                          Manage your account and move between pages from here.
                        </p>
                      </div>

                      <div className="mt-3 grid gap-1">
                        {navItems.map(({ to, label, icon: Icon }) => (
                          <NavLink
                            key={to}
                            to={to}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                              `inline-flex items-center gap-3 rounded-2xl px-3 py-2.5 transition ${
                                isActive
                                  ? "bg-[var(--app-accent-soft)] text-[var(--app-accent-strong)]"
                                  : "text-[var(--app-muted)] hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]"
                              }`
                            }
                          >
                            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[color:rgba(255,255,255,0.7)]">
                              <Icon size={15} />
                            </span>
                            {label}
                          </NavLink>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleLogout();
                          }}
                          className="inline-flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-[var(--app-danger)] transition hover:bg-[var(--app-surface-muted)]"
                        >
                          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[color:rgba(255,255,255,0.7)]">
                            <FiLogOut size={15} />
                          </span>
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/forgot-password"
                    className="hidden rounded-xl px-3 py-2 text-sm text-[var(--app-muted)] transition hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)] sm:inline-flex"
                  >
                    Reset password
                  </Link>
                  <Link to="/login" className="app-button-primary text-sm">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
