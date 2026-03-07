import axios from "axios";
import { BASE_URL, getPhotoUrl } from "../utils/constants";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data));
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-6xl mb-4">🤝</div>
        <h1 className="text-xl sm:text-2xl font-bold text-center opacity-80">
          No Connections Yet
        </h1>
        <p className="text-sm opacity-60 mt-2 text-center">
          Start swiping to connect with other developers
        </p>
      </div>
    );
  }

  return (
    connections && (
      <div className="px-4 py-8 sm:py-12 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          Your Connections
          <span className="badge badge-primary badge-lg ml-3 align-middle">
            {connections.length}
          </span>
        </h1>
        <div className="space-y-3 sm:space-y-4">
          {connections.map((connection) => {
            const { _id, firstName, lastName, age, gender, photoUrl, about } =
              connection;

            return (
              <div
                key={_id}
                className="flex items-center gap-4 p-4 rounded-xl bg-base-200 border border-base-300 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="avatar">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
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
            );
          })}
        </div>
      </div>
    )
  );
};

export default Connections;
