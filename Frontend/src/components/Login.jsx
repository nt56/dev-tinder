import { IoEye } from "react-icons/io5";
import { IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginform, setIsLoginForm] = useState(true);
  const [isShowPassword, setIsShowPassword] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      const authToken = res.headers["x-auth-token"];
      if (authToken) sessionStorage.setItem("_socket_token", authToken);
      navigate("/feed");
      toast.success("Login Successful..!");
    } catch (err) {
      toast.error(err?.response?.data);
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      const authToken = res.headers["x-auth-token"];
      if (authToken) sessionStorage.setItem("_socket_token", authToken);
      toast.success("Signup Successful..!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <section className="app-shell app-fade-up px-1">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md items-center">
        <div className="surface-card w-full px-5 py-6 sm:px-8 sm:py-8">
          <p className="hero-kicker">
            {isLoginform ? "Welcome back" : "Create account"}
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--app-text)]">
            {isLoginform ? "Sign in to continue" : "Get started with DevTinder"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
            {isLoginform
              ? "Access your profile, connections, and requests from one place."
              : "Create your account now and complete the rest of your profile after signup."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-[var(--app-surface-muted)] p-1">
            <button
              type="button"
              onClick={() => setIsLoginForm(true)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                isLoginform
                  ? "bg-white text-[var(--app-text)] shadow-sm"
                  : "text-[var(--app-muted)]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLoginForm(false)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                !isLoginform
                  ? "bg-white text-[var(--app-text)] shadow-sm"
                  : "text-[var(--app-muted)]"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {!isLoginform && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="field-label">First Name</span>
                  <input
                    type="text"
                    placeholder="John"
                    className="app-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>

                <label>
                  <span className="field-label">Last Name</span>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="app-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </div>
            )}

            <label>
              <span className="field-label">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="app-input"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>

            <label>
              <span className="field-label">Password</span>
              <div className="relative w-full">
                <input
                  type={isShowPassword ? "password" : "text"}
                  placeholder="••••••••"
                  className="app-input pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)] transition hover:text-[var(--app-text)]"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword ? (
                    <IoEye size={18} />
                  ) : (
                    <IoIosEyeOff size={18} />
                  )}
                </button>
              </div>
            </label>
          </div>

          {isLoginform ? (
            <div className="mt-3 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-[var(--app-muted)] transition hover:text-[var(--app-text)]"
              >
                Forgot password?
              </Link>
            </div>
          ) : null}

          <button
            type="button"
            className="app-button-primary mt-6 w-full"
            onClick={isLoginform ? handleLogin : handleSignUp}
          >
            {isLoginform ? "Sign In" : "Create Account"}
          </button>

          <p className="mt-4 text-center text-sm text-[var(--app-muted)]">
            {isLoginform ? "Need an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-medium text-[var(--app-text)]"
              onClick={() => setIsLoginForm(!isLoginform)}
            >
              {isLoginform ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
