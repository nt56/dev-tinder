import { useState } from "react";
import axios from "axios";
import { FiCamera, FiSave } from "react-icons/fi";
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
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Your profile";

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
    <section className="app-shell app-fade-up space-y-5 px-1">
      <div>
        <p className="hero-kicker">Profile</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--app-text)]">
          Edit your profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--app-muted)]">
          Keep the information clear and the photo well framed. The preview
          updates as you type.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="surface-card px-5 py-6 sm:px-7">
          <div className="space-y-5">
            <div className="surface-card-soft flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center">
              <div className="app-avatar-ring h-20 w-20 rounded-2xl sm:h-24 sm:w-24">
                <img
                  src={getPhotoUrl(photoUrl)}
                  alt="profile"
                  className="app-image-cover"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--app-text)]">
                  Profile photo
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--app-muted)]">
                  Upload a new image or paste an image URL below.
                </p>
              </div>

              <label className="app-button-secondary cursor-pointer">
                <FiCamera size={16} />
                {isUploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="field-label">First Name</span>
                <input
                  type="text"
                  className="app-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>

              <label>
                <span className="field-label">Last Name</span>
                <input
                  type="text"
                  className="app-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>

            <label>
              <span className="field-label">Photo URL</span>
              <input
                type="text"
                placeholder="https://example.com/photo.jpg"
                className="app-input"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="field-label">Age</span>
                <input
                  type="number"
                  className="app-input"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>

              <label>
                <span className="field-label">Gender</span>
                <select
                  className="app-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <label>
              <span className="field-label">About</span>
              <textarea
                className="app-textarea"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell people what you build and what you want to connect over."
              />
            </label>

            <button
              type="button"
              className="app-button-primary w-full"
              onClick={saveProfile}
            >
              <FiSave size={17} />
              Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-3 lg:sticky lg:top-24">
          <p className="text-sm font-medium text-[var(--app-text)]">Preview</p>
          <div className="surface-card overflow-hidden">
            <div className="aspect-[4/5] bg-[var(--app-surface-muted)]">
              <img
                src={getPhotoUrl(photoUrl)}
                alt="preview"
                className="app-image-cover"
              />
            </div>

            <div className="px-5 py-5">
              <h2 className="font-display text-2xl font-semibold text-[var(--app-text)]">
                {fullName}
              </h2>
              <p className="mt-1 text-sm text-[var(--app-muted)]">
                {age && gender
                  ? `${age} · ${gender}`
                  : "Add age and gender if you want more context on your card."}
              </p>
              <p className="mt-4 text-sm leading-6 text-[var(--app-muted)]">
                {about ||
                  "Your summary will appear here. Keep it short and easy to scan."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;
