import { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updatePassword } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/profile/forgotPassword",
        { password },
        { withCredentials: true }
      );
      dispatch(updatePassword(res.data));
      toast.success("Password Updated Successfully...!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <div className="card bg-base-300 shadow-xl flex items-center justify-center flex-col mx-auto mt-10 p-10 w-[40%]">
      <h1 className="card-title justify-center mb-5 text-2xl">
        Forgot Password
      </h1>
      <div>
        <div className="relative w-full">
          <input
            type={isShowPassword ? "password" : "text"}
            className="input input-bordered w-full max-w-xs pr-10"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setIsShowPassword(!isShowPassword)}
          >
            {isShowPassword ? <IoEye /> : <IoIosEyeOff />}
          </div>
        </div>
      </div>
      <div className="card-actions justify-center mt-5">
        <button className="btn btn-primary px-5" onClick={handleForgotPassword}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
