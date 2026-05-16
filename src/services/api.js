export const BASE_URL = "https://team-task-manager-production-d9e2.up.railway.app";

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
