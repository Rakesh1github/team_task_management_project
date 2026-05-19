export const BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://teamtaskmanagementproject-production.up.railway.app";

export const apiFetch = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: body ? JSON.stringify(body) : null,
  });

  return res.json();
};