import axios from "axios";
import { BASE_URL, getPhotoUrl } from "../utils/constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

  const dispatch = useDispatch();

  const handleSendRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(_id));
      toast.success("Connection " + status);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    user && (
      <div className="card bg-base-200 w-full max-w-sm shadow-2xl border border-base-300 overflow-hidden">
        <figure className="relative h-64 sm:h-72">
          <img
            src={getPhotoUrl(photoUrl)}
            alt="user-photo"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-300/90 to-transparent p-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {firstName + " " + lastName}
            </h2>
            {age && gender && (
              <p className="text-sm text-gray-300">{age + " · " + gender}</p>
            )}
          </div>
        </figure>
        <div className="card-body p-4 sm:p-6">
          <p className="text-sm opacity-80 line-clamp-3">{about}</p>
          <div className="card-actions justify-between mt-4">
            <button
              className="btn btn-outline btn-error flex-1"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              ✕ Ignore
            </button>
            <button
              className="btn btn-primary flex-1"
              onClick={() => handleSendRequest("interested", _id)}
            >
              ♥ Interested
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UserCard;
