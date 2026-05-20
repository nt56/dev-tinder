import axios from "axios";
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

  if (!feed) return;

  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-xl sm:text-2xl font-bold text-center opacity-80">
          No new users found!
        </h1>
        <p className="text-sm opacity-60 mt-2 text-center">
          Check back later for new developer matches
        </p>
      </div>
    );
  }

  return (
    feed && (
      <div className="flex items-center justify-center px-4 py-8 sm:py-12">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
