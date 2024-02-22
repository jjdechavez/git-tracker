import wretch from "wretch";

export function externalApi() {
  const token = localStorage.getItem("session");

  return wretch(import.meta.env.VITE_APP_API_URL).auth(`Bearer ${token}`);
}

export function getSearchParams(params: Record<string, string>) {
  const urlSearchParams = new URLSearchParams(params);

  return urlSearchParams.toString().length === 0
    ? urlSearchParams.toString()
    : `?${urlSearchParams.toString()}`;
}
