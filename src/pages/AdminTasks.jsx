import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/api";
import "../styles/AdminTasks.css";

const DEFAULT_TASKS = [
  { id: "def-task-1", title: "Design database schema", project: "Talos", status: "In Progress", dueDate: "2026-05-18", priority: "High", assignedTo: "Alice" },
  { id: "def-task-2", title: "Implement OAuth2 login", project: "API Gateway", status: "To Do", dueDate: "2026-05-22", priority: "Medium", assignedTo: "Bob" },
  { id: "def-task-3", title: "Create user onboarding flow", project: "Discuss", status: "Done", dueDate: "2026-05-10", priority: "High", assignedTo: "Charlie" },
  { id: "def-task-4", title: "Setup AWS S3 buckets", project: "S3 Connectors", status: "In Progress", dueDate: "2026-05-20", priority: "High", assignedTo: "Alice" },
  { id: "def-task-5", title: "Write weekly status report", project: "Timesheets", status: "To Do", dueDate: "2026-05-16", priority: "Low", assignedTo: "Bob" }
];

const AdminTasks = () => {

  const [fetchedTasks, setFetchedTasks] = useState([]);

  const [projects, setProjects]
    = useState([]);

  const [members, setMembers]
    = useState([]);

  const [showModal, setShowModal]
    = useState(false);

  const [title, setTitle]
    = useState("");

  const [project, setProject]
    = useState("");

  const [assignedToUserId,
    setAssignedToUserId]
    = useState("");

  const [dueDate, setDueDate]
    = useState("");

  const [priority, setPriority]
    = useState("");

  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const projectFilter = queryParams.get("project");
  const statusFilter = queryParams.get("status");

  const tasks = [...DEFAULT_TASKS, ...fetchedTasks];

  /* =========================
            GET TASKS
  ========================= */

  const fetchTasks = async () => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}/tasks`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    setFetchedTasks(data);
  };

  /* =========================
            GET PROJECTS
  ========================= */

  const fetchProjects = async () => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}/tasks/projects`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    const data =
      await response.json();

    setProjects(data);
  };

  /* =========================
      GET MEMBERS BY PROJECT
  ========================= */

  const fetchMembersByProject =
    async (projectId) => {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/tasks/project-members/${projectId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

      setMembers(data);
    };

  useEffect(() => {

    fetchTasks();

    fetchProjects();

  }, []);

  /* =========================
            CREATE TASK
  ========================= */

  const handleCreateTask =
    async () => {

      if (
        !title ||
        !project ||
        !assignedToUserId ||
        !dueDate ||
        !priority
      ) {

        setError(
          "All fields are required"
        );

        return;
      }

      setError("");

      const token =
        localStorage.getItem("token");

      await fetch(
        `${BASE_URL}/tasks`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({

            title,

            project:
              projects.find(
                (p) =>
                  p.id ==
                  project
              )?.name,

            projectId:
              parseInt(project),

            assignedToUserId:
              parseInt(
                assignedToUserId
              ),

            dueDate,

            priority
          })
        }
      );

      fetchTasks();

      setShowModal(false);

      setTitle("");

      setProject("");

      setAssignedToUserId("");

      setDueDate("");

      setPriority("");
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
  let headerText = "Manage tasks within your projects";
  if (projectFilter && statusFilter) {
    headerText = `Viewing ${statusFilter} tasks for project: ${projectFilter}`;
  } else if (projectFilter) {
    headerText = `Viewing tasks for project: ${projectFilter}`;
  } else if (statusFilter) {
    headerText = `Viewing ${statusFilter} tasks`;
  }

  return (

    <div className="admin-tasks">

      {/* TOP */}

      <div className="task-top">

        <div>
          <h2>Tasks</h2>
          <p>{headerText}</p>
          {(projectFilter || statusFilter) && (
            <button className="clear-filter-btn" onClick={() => navigate("/tasks")}>Clear Filter</button>
          )}
        </div>

        <button
          className="create-task-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Task
        </button>

      </div>

      {/* TABLE */}

      <div className="task-table-box">

        <table>

          <thead>

            <tr>
              <th>Task Title</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>
            {displayTasks.map((task) => (
              <tr key={task.id}>

                <td>{task.title}</td>

                <td>{task.project}</td>

                <td>
                  {task.assignedTo}
                </td>

                <td>{task.dueDate}</td>

                <td>

                  <span
                    className={`priority ${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>

                </td>

                <td>

                  <span
                    className={`status ${task.status.replace(" ", "").toLowerCase()}`}
                  >
                    {task.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>Create Task</h3>

            {/* ERROR */}

            {
              error && (
                <p className="error-msg">
                  {error}
                </p>
              )
            }

            {/* TITLE */}

            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />

            {/* PROJECT */}

            <select
              value={project}
              onChange={(e) => {

                setProject(
                  e.target.value
                );

                fetchMembersByProject(
                  e.target.value
                );
              }}
            >

              <option value="">
                Select Project
              </option>

              {projects.map((item) => (

                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>

              ))}

            </select>

            {/* ASSIGN */}

            <select
              value={assignedToUserId}
              onChange={(e) =>
                setAssignedToUserId(
                  e.target.value
                )
              }
            >

              <option value="">
                Assign Member
              </option>

              {members.map((member) => (

                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.name}
                </option>

              ))}

            </select>

            {/* DATE */}

            <input
              type="date"
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              value={dueDate}
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
            />

            {/* PRIORITY */}

            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Priority
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>

            </select>

            {/* BUTTONS */}

            <div className="modal-buttons">

              <button
                className="save-btn"
                onClick={
                  handleCreateTask
                }
              >
                Create
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminTasks;