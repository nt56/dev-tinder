import axios from "axios";
import { FiCheck, FiClock, FiX } from "react-icons/fi";
import { BASE_URL, getPhotoUrl } from "../utils/constants";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data));
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const reviewRequest = async (status, id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + id,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(id));
      toast.success("Request " + status);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0) {
    return (
      <section className="app-shell app-fade-up px-1">
        <div className="page-hero empty-state min-h-[60vh] px-6 py-10 sm:px-10">
          <div className="empty-state-icon">
            <FiClock size={28} />
          </div>
          <h1 className="font-display text-3xl font-semibold text-[var(--app-text)] sm:text-4xl">
            No pending requests
          </h1>
          <p className="max-w-xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
            New requests will appear here when someone wants to connect.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="app-shell app-fade-up space-y-5 px-1">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="hero-kicker">Requests</p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--app-text)]">
            Pending requests
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--app-muted)]">
            Review each request and choose whether to accept or reject it.
          </p>
        </div>

        <span className="info-pill">{requests.length} pending</span>
      </div>

      <div className="list-grid md:grid-cols-2">
        {requests.map((request) => {
          const { firstName, lastName, age, gender, photoUrl, about } =
            request.fromUserId;
          const fullName = [firstName, lastName].filter(Boolean).join(" ");

          return (
            <article key={request._id} className="surface-card p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="app-avatar-ring h-20 w-20 shrink-0 rounded-2xl">
                  <img
                    src={getPhotoUrl(photoUrl)}
                    alt="user-photo"
                    className="app-image-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-[var(--app-text)]">
                        {fullName}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--app-muted)]">
                        {age && gender ? `${age} · ${gender}` : "New request"}
                      </p>
                    </div>
                    <span className="info-pill shrink-0">Pending</span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[var(--app-muted)]">
                    {about || "No summary added yet."}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="app-button-ghost w-full"
                      onClick={() => reviewRequest("rejected", request._id)}
                    >
                      <FiX size={17} />
                      Reject
                    </button>
                    <button
                      type="button"
                      className="app-button-primary w-full"
                      onClick={() => reviewRequest("accepted", request._id)}
                    >
                      <FiCheck size={17} />
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Requests;
