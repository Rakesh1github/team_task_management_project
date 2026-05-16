import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/api";
import "../styles/dashboard.css";

const DEFAULT_TASKS = [
  { id: "def-task-1", title: "Design database schema", project: "Talos", status: "In Progress", dueDate: "2026-05-18" },
  { id: "def-task-2", title: "Implement OAuth2 login", project: "API Gateway", status: "To Do", dueDate: "2026-05-22" },
  { id: "def-task-3", title: "Create user onboarding flow", project: "Discuss", status: "Done", dueDate: "2026-05-10" },
  { id: "def-task-4", title: "Setup AWS S3 buckets", project: "S3 Connectors", status: "In Progress", dueDate: "2026-05-20" },
  { id: "def-task-5", title: "Write weekly status report", project: "Timesheets", status: "To Do", dueDate: "2026-05-16" }
];

const MemberDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      let fetchedTasks = [];
      const response = await fetch(`${BASE_URL}/member-features/tasks/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(response.ok){
        fetchedTasks = await response.json();
      }
      
      const allTasks = [...DEFAULT_TASKS, ...fetchedTasks];
      const today = new Date().toISOString().split("T")[0];

      const computedData = {
        totalProjects: 12, // Default modules + any others
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(t => t.status === "Done").length,
        inProgressTasks: allTasks.filter(t => t.status === "In Progress").length,
        todoTasks: allTasks.filter(t => t.status === "To Do").length,
        overdueTasks: allTasks.filter(t => t.status !== "Done" && t.dueDate < today).length
      };

      setData(computedData);
      
    } catch(err){
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const userName = localStorage.getItem("name") || "Member";

  return (
    <div className="dashboard-container">
      {/* STATS GRID */}
      <div className="dashboard-section">
        <h3 className="section-title">My Metrics</h3>
        {loading || !data ? (
          <div className="dashboard-grid skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="stat-card skeleton-card"></div>
            ))}
          </div>
        ) : (
          <div className="dashboard-grid">
            <div className="stat-card border-blue clickable-card" onClick={() => navigate("/projects")}>
              <div className="stat-header">
                <p>My Projects</p>
                <span className="icon-wrapper bg-blue">📁</span>
              </div>
              <h2>{data.totalProjects || 0}</h2>
            </div>
            
            <div className="stat-card border-purple clickable-card" onClick={() => navigate("/tasks")}>
              <div className="stat-header">
                <p>My Tasks</p>
                <span className="icon-wrapper bg-purple">✅</span>
              </div>
              <h2>{data.totalTasks || 0}</h2>
            </div>

            <div className="stat-card border-green clickable-card" onClick={() => navigate("/tasks?status=Done")}>
              <div className="stat-header">
                <p>Completed</p>
                <span className="icon-wrapper bg-green">✔️</span>
              </div>
              <h2>{data.completedTasks || 0}</h2>
            </div>

            <div className="stat-card border-yellow clickable-card" onClick={() => navigate("/tasks?status=In Progress")}>
              <div className="stat-header">
                <p>In Progress</p>
                <span className="icon-wrapper bg-yellow">⏳</span>
              </div>
              <h2>{data.inProgressTasks || 0}</h2>
            </div>

            <div className="stat-card border-gray clickable-card" onClick={() => navigate("/tasks?status=To Do")}>
              <div className="stat-header">
                <p>To Do</p>
                <span className="icon-wrapper bg-gray">📝</span>
              </div>
              <h2>{data.todoTasks || 0}</h2>
            </div>

            <div className="stat-card border-red clickable-card" onClick={() => navigate("/tasks?status=Overdue")}>
              <div className="stat-header">
                <p>Overdue</p>
                <span className="icon-wrapper bg-red">⚠️</span>
              </div>
              <h2>{data.overdueTasks || 0}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;