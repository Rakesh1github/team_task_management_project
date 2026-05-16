import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/api";
import "../styles/dashboard.css";

const DEFAULT_TASKS = [
  { id: "def-task-1", title: "Design database schema", project: "Talos", status: "In Progress", dueDate: "2026-05-18", priority: "High", assignedTo: "Alice" },
  { id: "def-task-2", title: "Implement OAuth2 login", project: "API Gateway", status: "To Do", dueDate: "2026-05-22", priority: "Medium", assignedTo: "Bob" },
  { id: "def-task-3", title: "Create user onboarding flow", project: "Discuss", status: "Done", dueDate: "2026-05-10", priority: "High", assignedTo: "Charlie" },
  { id: "def-task-4", title: "Setup AWS S3 buckets", project: "S3 Connectors", status: "In Progress", dueDate: "2026-05-20", priority: "High", assignedTo: "Alice" },
  { id: "def-task-5", title: "Write weekly status report", project: "Timesheets", status: "To Do", dueDate: "2026-05-16", priority: "Low", assignedTo: "Bob" }
];

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      let fetchedTasks = [];
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchedTasks = await response.json();
      }

      const allTasks = [...DEFAULT_TASKS, ...fetchedTasks];
      const today = new Date().toISOString().split("T")[0];

      const totalProjects = 12; // 12 default modules
      const totalTasks = allTasks.length;
      const completedTasks = allTasks.filter(t => t.status === "Done").length;
      const inProgressTasks = allTasks.filter(t => t.status === "In Progress").length;
      const todoTasks = allTasks.filter(t => t.status === "To Do").length;
      const overdueTasks = allTasks.filter(t => t.status !== "Done" && t.dueDate < today).length;

      setStats([
        { title: "Total Projects", value: totalProjects, icon: "📁", color: "blue", route: "/projects" },
        { title: "Total Tasks", value: totalTasks, icon: "✅", color: "purple", route: "/tasks" },
        { title: "Completed Tasks", value: completedTasks, icon: "✔️", color: "green", route: "/tasks?status=Done" },
        { title: "In Progress", value: inProgressTasks, icon: "⏳", color: "yellow", route: "/tasks?status=In Progress" },
        { title: "To Do", value: todoTasks, icon: "📝", color: "gray", route: "/tasks?status=To Do" },
        { title: "Overdue Tasks", value: overdueTasks, icon: "⚠️", color: "red", route: "/tasks?status=Overdue" }
      ]);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const userName = localStorage.getItem("name") || "Admin";

  return (
    <div className="dashboard-container">
      {/* STATS GRID */}
      <div className="dashboard-section">
        <h3 className="section-title">Overview Metrics</h3>
        {loading ? (
          <div className="dashboard-grid skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="stat-card skeleton-card"></div>
            ))}
          </div>
        ) : (
          <div className="dashboard-grid">
            {stats.map((item, index) => (
              <div 
                className={`stat-card border-${item.color} clickable-card`} 
                key={index}
                onClick={() => navigate(item.route)}
              >
                <div className="stat-header">
                  <p>{item.title}</p>
                  <span className={`icon-wrapper bg-${item.color}`}>
                    {item.icon}
                  </span>
                </div>
                <h2>{item.value || 0}</h2>
                <div className="stat-footer">
                  <span className="trend positive">↑ Updated</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;