import axios from "axios";
import { FiHeart, FiX } from "react-icons/fi";
import { BASE_URL, getPhotoUrl } from "../utils/constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, queueSize }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const dispatch = useDispatch();

  const handleSendRequest = async (status, id) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + id,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(id));
      toast.success("Connection " + status);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <div className="surface-card overflow-hidden">
      <div className="relative aspect-[4/5] bg-[var(--app-surface-muted)]">
        <img
          src={getPhotoUrl(photoUrl)}
          alt="user-photo"
          className="app-image-cover"
        />
        {queueSize ? (
          <span className="absolute right-4 top-4 rounded-lg bg-white/90 px-3 py-2 text-xs font-medium text-[var(--app-text)] shadow-sm">
            {queueSize} in queue
          </span>
        ) : null}
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--app-text)] sm:text-3xl">
              {fullName}
            </h2>
            <p className="mt-1 text-sm text-[var(--app-muted)]">
              {age && gender ? `${age} · ${gender}` : "Developer profile"}
            </p>
          </div>

          <span className="info-pill shrink-0">
            {queueSize > 1 ? `${queueSize - 1} left` : "Last one"}
          </span>
        </div>

        <p className="text-sm leading-6 text-[var(--app-muted)]">
          {about ||
            "This developer has not added a summary yet, but you can still review the profile."}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="app-button-ghost w-full"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            <FiX size={17} />
            Ignore
          </button>

          <button
            type="button"
            className="app-button-primary w-full"
            onClick={() => handleSendRequest("interested", _id)}
          >
            <FiHeart size={17} />
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
