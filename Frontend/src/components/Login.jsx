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
      navigate("/");
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
      toast.success("Signup Successful..!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4">
      <div className="card bg-base-200 w-full max-w-md shadow-2xl border border-base-300">
        <div className="card-body gap-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              {isLoginform ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm opacity-70 mt-1">
              {isLoginform
                ? "Sign in to find your dev match"
                : "Join the developer community"}
            </p>
          </div>

          <div className="space-y-3">
            {!isLoginform && (
              <>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">First Name</span>
                  </div>
                  <input
                    type="text"
                    placeholder="John"
                    className="input input-bordered w-full focus:input-primary"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">Last Name</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="input input-bordered w-full focus:input-primary"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </>
            )}

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Email</span>
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full focus:input-primary"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Password</span>
              </div>
              <div className="relative w-full">
                <input
                  type={isShowPassword ? "password" : "text"}
                  placeholder="••••••••"
                  className="input input-bordered w-full pr-10 focus:input-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
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

          {isLoginform && (
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          <div className="card-actions mt-2">
            <button
              className="btn btn-primary w-full text-base"
              onClick={isLoginform ? handleLogin : handleSignUp}
            >
              {isLoginform ? "Sign In" : "Sign Up"}
            </button>
          </div>

          <div className="divider text-xs opacity-50">OR</div>

          <p
            className="text-center cursor-pointer text-sm hover:text-primary transition-colors"
            onClick={() => setIsLoginForm(!isLoginform)}
          >
            {isLoginform
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
