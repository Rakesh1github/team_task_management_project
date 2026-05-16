import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/api";
import "../styles/MemberMyTasks.css";

const DEFAULT_TASKS = [
  { id: "def-task-1", title: "Design database schema", project: "Talos", status: "In Progress", dueDate: "2026-05-18" },
  { id: "def-task-2", title: "Implement OAuth2 login", project: "API Gateway", status: "To Do", dueDate: "2026-05-22" },
  { id: "def-task-3", title: "Create user onboarding flow", project: "Discuss", status: "Done", dueDate: "2026-05-10" },
  { id: "def-task-4", title: "Setup AWS S3 buckets", project: "S3 Connectors", status: "In Progress", dueDate: "2026-05-20" },
  { id: "def-task-5", title: "Write weekly status report", project: "Timesheets", status: "To Do", dueDate: "2026-05-16" }
];

const MemberMyTasks = () => {
  const [fetchedTasks, setFetchedTasks] = useState([]);
  const [tasks, setTasks] = useState([...DEFAULT_TASKS]);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const projectFilter = queryParams.get("project");
  const statusFilter = queryParams.get("status");

  /* =========================
        CREATE TASK MODAL
  ========================= */
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("To Do");

  /* =========================
        FETCH TASKS
  ========================= */
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(`${BASE_URL}/member-features/tasks/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(response.ok){
        const data = await response.json();
        setFetchedTasks(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setTasks([...DEFAULT_TASKS, ...fetchedTasks]);
  }, [fetchedTasks]);

  /* =========================
        CREATE TASK LOGIC
  ========================= */
  const handleCreateTask = async () => {
    if (!title || !project || !dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    const newTask = {
      id: "local-" + Date.now(),
      title,
      project,
      status,
      dueDate
    };

    // Optimistically add to UI
    setTasks([newTask, ...tasks]);
    setShowModal(false);
    setTitle("");
    setProject("");
    setDueDate("");
    setStatus("To Do");

    // Try backend (if allowed)
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newTask)
      });
    } catch (err) {
      console.error("Member task creation failed on backend:", err);
    }
  };

  /* =========================
        UPDATE STATUS
  ========================= */
  const handleStatusChange = async (taskId, newStatus) => {
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    if (!String(taskId).startsWith("def-") && !String(taskId).startsWith("local-")) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${BASE_URL}/member-features/tasks/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status: newStatus })
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  /* =========================
        DELETE TASK
  ========================= */
  const handleDeleteTask = async (taskId) => {
    // Optimistically remove from UI
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));

    if (!String(taskId).startsWith("def-") && !String(taskId).startsWith("local-")) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${BASE_URL}/member-features/tasks/${taskId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to delete task on backend:", err);
      }
    }
  };

  // Filter logic
  let displayTasks = tasks;
  const today = new Date().toISOString().split("T")[0];

  if (projectFilter) {
    displayTasks = displayTasks.filter(t => t.project === projectFilter);
  }

  if (statusFilter) {
    if (statusFilter === "Overdue") {
      displayTasks = displayTasks.filter(t => t.status !== "Done" && t.dueDate < today);
    } else {
      displayTasks = displayTasks.filter(t => t.status === statusFilter);
    }
  }

  // Header text logic
  let headerText = "View, add, and update assigned tasks";
  if (projectFilter && statusFilter) {
    headerText = `Viewing ${statusFilter} tasks for project: ${projectFilter}`;
  } else if (projectFilter) {
    headerText = `Viewing tasks for project: ${projectFilter}`;
  } else if (statusFilter) {
    headerText = `Viewing ${statusFilter} tasks`;
  }

  return (
    <div className="member-tasks">
      {/* HEADER */}
      <div className="member-task-top">
        <div>
          <h2>My Tasks</h2>
          <p>{headerText}</p>
          {(projectFilter || statusFilter) && (
            <button className="clear-filter-btn" onClick={() => navigate("/tasks")}>Clear Filter</button>
          )}
        </div>
        <button className="create-task-btn" onClick={() => setShowModal(true)}>
          + Add Task
        </button>
      </div>

      {/* TABLE */}
      <div className="member-task-table">
        <table>
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Project</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.project}</td>
                <td>
                  <span className={`status ${task.status.replace(" ", "").toLowerCase()}`}>
                    {task.status}
                  </span>
                </td>
                <td>{task.dueDate}</td>
                <td>
                  <div className="action-cell">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="status-dropdown"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                    <button 
                      className="icon-btn delete-inline" 
                      onClick={() => handleDeleteTask(task.id)} 
                      title="Remove Task"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal glass-modal">
            <h3>Add New Task</h3>
            
            <div className="input-group">
              <label>Task Title</label>
              <input type="text" placeholder="Enter task title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            
            <div className="input-group">
              <label>Project Name</label>
              <input type="text" placeholder="E.g. Discuss, Atlas..." value={project} onChange={(e) => setProject(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="save-btn" onClick={handleCreateTask}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberMyTasks;