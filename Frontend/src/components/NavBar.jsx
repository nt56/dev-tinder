import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL, getPhotoUrl } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { toast } from "react-toastify";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
      toast.success("Logout Successful...!");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  if (!user) return;

  return (
    <div className="navbar bg-base-200 shadow-lg px-4 sm:px-6 lg:px-8">
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost text-lg sm:text-xl font-bold text-primary normal-case"
        >
          🧑‍💻 DevTinder
        </Link>
      </div>
      {user && (
        <div className="flex-none gap-2 sm:gap-4 items-center">
          <p className="hidden sm:block text-sm font-medium opacity-80">
            Welcome, {user.firstName}
          </p>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar online"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img alt="user-photo" src={getPhotoUrl(user.photoUrl)} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-300"
            >
              <li className="sm:hidden">
                <span className="font-semibold text-primary">
                  Hi, {user.firstName}
                </span>
              </li>
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge badge-primary badge-sm">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <div className="divider my-0"></div>
              <li>
                <a onClick={handleLogout} className="text-error">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
