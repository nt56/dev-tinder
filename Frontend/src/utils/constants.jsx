export const BASE_URL =
  location.hostname === "localhost" ? "http://localhost:3000" : "/api";

export const getPhotoUrl = (url) => {
  if (!url) return "https://geographyandyou.com/images/user-profile.png";
  if (url.startsWith("/uploads/")) return BASE_URL + url;
  return url;
};
