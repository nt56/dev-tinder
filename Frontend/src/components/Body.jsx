import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Body = () => {
  const userData = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthResolved, setIsAuthResolved] = useState(Boolean(userData));

  const publicRoutes = new Set(["/", "/login", "/forgot-password"]);
  const isPublicRoute = publicRoutes.has(location.pathname);
  const shouldHoldProtectedContent =
    !isPublicRoute && !userData && !isAuthResolved;

  useEffect(() => {
    let isCancelled = false;

    if (userData) {
      setIsAuthResolved(true);
      return undefined;
    }

    setIsAuthResolved(false);

    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });

        if (isCancelled) {
          return;
        }

        dispatch(addUser(res.data));
        setIsAuthResolved(true);
      } catch (err) {
        if (isCancelled) {
          return;
        }

        setIsAuthResolved(true);

        if (err.response?.status === 401) {
          if (!isPublicRoute) {
            navigate("/login", { replace: true });
          }
        } else {
          toast.error(err.response?.data || "Something went wrong");
        }
      }
    };

    fetchUser();

    return () => {
      isCancelled = true;
    };
  }, [dispatch, isPublicRoute, navigate, location.pathname, userData]);

  useEffect(() => {
    if (!userData) {
      return;
    }

    if (
      location.pathname === "/login" ||
      location.pathname === "/forgot-password"
    ) {
      navigate("/feed", { replace: true });
    }
  }, [location.pathname, navigate, userData]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--app-bg)]">
      <NavBar />
      <main className="flex-1 py-4 sm:py-6">
        {shouldHoldProtectedContent ? (
          <section className="app-shell app-fade-up px-1">
            <div className="page-hero flex min-h-[calc(100vh-12rem)] items-center justify-center px-6 py-10 text-center sm:px-10">
              <div>
                <p className="hero-kicker mx-auto">Checking session</p>
                <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--app-text)]">
                  One moment while we verify your account
                </h1>
                <p className="mt-2 max-w-md text-sm leading-6 text-[var(--app-muted)] sm:text-base">
                  We are confirming your login status before loading the app.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <Outlet context={{ isAuthResolved }} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Body;
