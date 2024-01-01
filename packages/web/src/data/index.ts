import wretch from "wretch";

const token = localStorage.getItem("session");

export const externalApi = wretch(import.meta.env.VITE_APP_API_URL).auth(
  `Bearer ${token}`
);
