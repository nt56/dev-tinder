import axios from "axios";
import { FiCompass } from "react-icons/fi";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length === 0) {
    return (
      <section className="app-shell app-fade-up px-1">
        <div className="page-hero empty-state min-h-[60vh] px-6 py-10 sm:px-10">
          <div className="empty-state-icon">
            <FiCompass size={28} />
          </div>
          <h1 className="font-display text-3xl font-semibold text-[var(--app-text)] sm:text-4xl">
            No profiles right now
          </h1>
          <p className="max-w-xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
            You have already reviewed the current queue. Check back later for
            more developers.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="app-shell app-fade-up space-y-5 px-1">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="hero-kicker">Discover</p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--app-text)]">
            Discover developers
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--app-muted)]">
            Review one profile at a time and decide whether you want to connect.
          </p>
        </div>

        <span className="info-pill">{feed.length} profiles available</span>
      </div>

      <div className="mx-auto w-full max-w-md lg:max-w-lg">
        <UserCard user={feed[0]} queueSize={feed.length} />
      </div>
    </section>
  );
};

export default Feed;
