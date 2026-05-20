import axios from "axios";
import { FiLink2 } from "react-icons/fi";
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

  if (!connections) return null;

  if (connections.length === 0) {
    return (
      <section className="app-shell app-fade-up px-1">
        <div className="page-hero empty-state min-h-[60vh] px-6 py-10 sm:px-10">
          <div className="empty-state-icon">
            <FiLink2 size={28} />
          </div>
          <h1 className="font-display text-3xl font-semibold text-[var(--app-text)] sm:text-4xl">
            No connections yet
          </h1>
          <p className="max-w-xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
            Once people accept your requests, they will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="app-shell app-fade-up space-y-5 px-1">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="hero-kicker">Connections</p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--app-text)]">
            Your connections
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--app-muted)]">
            A simple list of developers you are connected with.
          </p>
        </div>

        <span className="info-pill">{connections.length} connections</span>
      </div>

      <div className="list-grid md:grid-cols-2">
        {connections.map((connection) => {
          const { _id, firstName, lastName, age, gender, photoUrl, about } =
            connection;
          const fullName = [firstName, lastName].filter(Boolean).join(" ");

          return (
            <article
              key={_id}
              className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-start"
            >
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
                      {age && gender
                        ? `${age} · ${gender}`
                        : "Connected developer"}
                    </p>
                  </div>
                  <span className="info-pill shrink-0">Connected</span>
                </div>

                <p className="mt-3 text-sm leading-6 text-[var(--app-muted)]">
                  {about || "No summary added yet."}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Connections;
