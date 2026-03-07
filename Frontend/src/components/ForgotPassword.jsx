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
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4">
      <div className="card bg-base-200 w-full max-w-md shadow-2xl border border-base-300">
        <div className="card-body gap-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              Reset Password
            </h2>
            <p className="text-sm opacity-70 mt-1">
              Enter your email and new password
            </p>
          </div>

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
              <span className="label-text font-medium">New Password</span>
            </div>
            <div className="relative w-full">
              <input
                type={isShowPassword ? "password" : "text"}
                placeholder="••••••••"
                className="input input-bordered w-full pr-10 focus:input-primary"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          <div className="card-actions mt-2">
            <button
              className="btn btn-primary w-full text-base"
              onClick={handleForgotPassword}
            >
              Reset Password
            </button>
          </div>

          <p
            className="text-center cursor-pointer text-sm hover:text-primary transition-colors"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
