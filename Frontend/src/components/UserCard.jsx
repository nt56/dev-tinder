import axios from "axios";
import { BASE_URL } from "../utils/constants";
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
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(_id));
      toast.success("Connection " + status);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    user && (
      <div>
        <div className="card bg-base-300 w-96 shadow-xl">
          <figure>
            <img src={photoUrl} alt="user-photo" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-xl font-bold">
              {firstName + " " + lastName}
            </h2>
            {age && gender && <p>{age + ", " + gender}</p>}

            <p>{about}</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() => handleSendRequest("ignored", _id)}
              >
                Ignore
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleSendRequest("interested", _id)}
              >
                Interested
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default UserCard;
