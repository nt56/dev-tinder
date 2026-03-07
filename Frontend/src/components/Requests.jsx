import axios from "axios";
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

  const reviewRequest = async (status, _id) => {
    try {
      const res = axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(_id));
      toast.success("Request " + status);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-6xl mb-4">📬</div>
        <h1 className="text-xl sm:text-2xl font-bold text-center opacity-80">
          No Pending Requests
        </h1>
        <p className="text-sm opacity-60 mt-2 text-center">
          When someone is interested, their request will appear here
        </p>
      </div>
    );

  return (
    requests && (
      <div className="px-4 py-8 sm:py-12 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          Connection Requests
          <span className="badge badge-secondary badge-lg ml-3 align-middle">
            {requests.length}
          </span>
        </h1>
        <div className="space-y-3 sm:space-y-4">
          {requests.map((request) => {
            const { _id, firstName, lastName, age, gender, photoUrl, about } =
              request.fromUserId;

            return (
              <div
                key={_id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-base-200 border border-base-300 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="avatar">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-1">
                      <img
                        src={getPhotoUrl(photoUrl)}
                        className="object-cover"
                        alt="user-photo"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base sm:text-lg truncate">
                      {firstName + " " + lastName}
                    </h2>
                    {age && gender && (
                      <p className="text-xs sm:text-sm opacity-60">
                        {age + " · " + gender}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm opacity-70 mt-1 line-clamp-1">
                      {about}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
                  <button
                    className="btn btn-outline btn-error btn-sm flex-1 sm:flex-none"
                    onClick={() => reviewRequest("rejected", request._id)}
                  >
                    Reject
                  </button>
                  <button
                    className="btn btn-primary btn-sm flex-1 sm:flex-none"
                    onClick={() => reviewRequest("accepted", request._id)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default Requests;
