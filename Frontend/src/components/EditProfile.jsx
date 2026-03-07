import { useState } from "react";
import axios from "axios";
import { BASE_URL, getPhotoUrl } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { toast } from "react-toastify";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useDispatch();

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    setIsUploading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/profile/upload-photo",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setPhotoUrl(res.data.photoUrl);
      toast.success("Photo uploaded successfully!");
    } catch (err) {
      toast.error(err?.response?.data || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, about, photoUrl },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      toast.success("Profile Edit Successful..!");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-10 px-4 py-8 sm:py-12">
      {/* Edit Form */}
      <div className="card bg-base-200 w-full max-w-md shadow-2xl border border-base-300">
        <div className="card-body gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-primary">
            Edit Profile
          </h2>

          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={getPhotoUrl(photoUrl)} alt="profile" />
              </div>
            </div>
            <label className="btn btn-sm btn-outline btn-primary">
              {isUploading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Upload Photo"
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">First Name</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full focus:input-primary"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Last Name</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full focus:input-primary"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Photo URL</span>
            </div>
            <input
              type="text"
              placeholder="https://example.com/photo.jpg"
              className="input input-bordered w-full focus:input-primary"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Age</span>
              </div>
              <input
                type="number"
                className="input input-bordered w-full focus:input-primary"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Gender</span>
              </div>
              <select
                className="select select-bordered w-full focus:select-primary"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">About</span>
            </div>
            <textarea
              className="textarea textarea-bordered w-full focus:textarea-primary h-24 resize-none"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </label>

          <div className="card-actions mt-4">
            <button className="btn btn-primary w-full" onClick={saveProfile}>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="w-full max-w-sm">
        <p className="text-center text-sm font-medium opacity-60 mb-3">
          Live Preview
        </p>
        <div className="card bg-base-200 shadow-2xl border border-base-300 overflow-hidden">
          <figure className="relative h-64 sm:h-72">
            <img
              src={getPhotoUrl(photoUrl)}
              alt="preview"
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
            <p className="text-sm opacity-80">{about}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
