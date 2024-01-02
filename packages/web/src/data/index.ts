import wretch from "wretch";

export function externalApi() {
  const token = localStorage.getItem("session");

  return wretch(import.meta.env.VITE_APP_API_URL).auth(`Bearer ${token}`);
}
