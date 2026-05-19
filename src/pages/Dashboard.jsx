import React from "react";
import AdminDashboard from "./AdminDashboard";
import MemberDashboard from "./MemberDashboard";

const Dashboard = () => {

  // ✅ ADD HERE (TOP)
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = import.meta.env.BASE_URL;
    return null;
  }

  const role = localStorage.getItem("role");

  return role === "ADMIN" ? <AdminDashboard /> : <MemberDashboard />;
};

export default Dashboard;