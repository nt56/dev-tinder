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
        { withCredentials: true }
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
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      toast.success("Signup Successful..!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginform ? "Login" : "SignUp"}
          </h2>
          <div>
            {!isLoginform && (
              <div>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">First Name</span>
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full max-w-xs"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full max-w-xs"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </div>
            )}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email Id</span>
              </div>
              <input
                type="email"
                className="input input-bordered w-full max-w-xs"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <div className="relative w-full">
                <input
                  type={isShowPassword ? "password" : "text"}
                  className="input input-bordered w-full max-w-xs pr-10"
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
            </label>
          </div>
          {/* {isLoginform && (
            <Link to="/forgotPassword" className="cursor-pointer">
              <p className="font-bold text-white">Forgot Password</p>
            </Link>
          )} */}
          <div className="card-actions justify-center mt-5">
            <button
              className="btn btn-primary"
              onClick={isLoginform ? handleLogin : handleSignUp}
            >
              {isLoginform ? "Login" : "SignUp"}
            </button>
          </div>
          <p
            className="m-auto cursor-pointer pt-2"
            onClick={() => setIsLoginForm(!isLoginform)}
          >
            {isLoginform ? "New User? SignUp" : "Existing User? Login"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
