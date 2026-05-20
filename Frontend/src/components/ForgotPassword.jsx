import { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [emailId, setEmailId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      const res = await axios.post(BASE_URL + "/forgot-password", {
        emailId,
        newPassword,
      });
      toast.success(res.data);
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <section className="app-shell app-fade-up px-1">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md items-center">
        <div className="surface-card w-full px-5 py-6 sm:px-8 sm:py-8">
          <p className="hero-kicker">Reset password</p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--app-text)]">
            Choose a new password
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
            Enter the email linked to your account and set a new password.
          </p>

          <div className="mt-6 space-y-4">
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
              <span className="field-label">New Password</span>
              <div className="relative w-full">
                <input
                  type={isShowPassword ? "password" : "text"}
                  placeholder="••••••••"
                  className="app-input pr-12"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

          <button
            type="button"
            className="app-button-primary mt-6 w-full"
            onClick={handleForgotPassword}
          >
            Reset Password
          </button>

          <button
            type="button"
            className="app-button-ghost mt-3 w-full"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
