import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();

  const fetchRequests = async () => {
    if (requests) return;
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data));
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;
  if (requests.length === 0) {
    return (
      <h1 className="text-bold text-white text-3xl">Requests Not Found...!</h1>
    );
  }

  return (
    requests && (
      <div className="text-center my-10">
        <h1 className="text-bold text-white text-3xl">Connections Requests</h1>
        {requests.map((request) => {
          const { _id, firstName, lastName, age, gender, photoUrl, about } =
            request;

          return (
            <div
              key={_id}
              className=" flex justify-between items-center m-4 p-4 rounded-lg bg-base-300  mx-auto w-1/2"
            >
              <div>
                <img
                  src={photoUrl}
                  className="w-20 h-20 rounded-full"
                  alt="user-photo"
                />
              </div>
              <div className="text-left mx-4 ">
                <h2 className="font-bold text-xl">
                  {firstName + " " + lastName}
                </h2>
                {age && gender && <p>{age + ", " + gender}</p>}
                <p>{about}</p>
              </div>
              <div>
                <button className="btn btn-primary mx-2">Reject</button>
                <button className="btn btn-secondary mx-2">Accept</button>
              </div>
            </div>
          );
        })}
      </div>
    )
  );
};

export default Requests;
