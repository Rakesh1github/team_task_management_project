export const saveLogin = (token, userId, role, name, email) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("role", role);
  localStorage.setItem("name", name);
  localStorage.setItem("email", email);

};

export const getToken = () => localStorage.getItem("token");

export const getRoles = () =>
  localStorage.getItem("role");

export const isAdmin = () =>
  getRoles()==="ADMIN";

export const isMember = () =>
  getRoles()==="MEMBER";

export const isLoggedIn = () => !!getToken();

export const logout = () => {
  localStorage.clear();
  window.location.href = import.meta.env.BASE_URL;
};