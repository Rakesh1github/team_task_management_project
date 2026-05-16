// src/pages/Tasks.js
import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import Navbar from "../components/Sidebar";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ title: "", description: "" });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await apiFetch("/tasks/project/1");
    setTasks(res);
  };

  const createTask = async () => {
    await apiFetch("/tasks?userId=1&projectId=1", "POST", task);
    loadTasks();
  };

  const updateStatus = async (id, status) => {
    await apiFetch(`/tasks/${id}/status?status=${status}`, "PUT");
    loadTasks();
  };

  const renderTasks = (status) =>
    tasks
      .filter((t) => t.status === status)
      .map((t) => (
        <div key={t.id} className="task-card">
          <h4>{t.title}</h4>
          <p>{t.description}</p>

          <button onClick={() => updateStatus(t.id, "TODO")}>Todo</button>
          <button onClick={() => updateStatus(t.id, "IN_PROGRESS")}>In Progress</button>
          <button onClick={() => updateStatus(t.id, "DONE")}>Done</button>
        </div>
      ));

  return (
    <>
      <Navbar />
      <div className="task-container">
        <h2>Tasks</h2>

        <div>
          <input placeholder="Title" onChange={(e) => setTask({ ...task, title: e.target.value })} />
          <input placeholder="Description" onChange={(e) => setTask({ ...task, description: e.target.value })} />
          <button onClick={createTask}>Create Task</button>
        </div>

        <div className="columns">
          <div>
            <h3>TODO</h3>
            {renderTasks("TODO")}
          </div>

          <div>
            <h3>IN PROGRESS</h3>
            {renderTasks("IN_PROGRESS")}
          </div>

          <div>
            <h3>DONE</h3>
            {renderTasks("DONE")}
          </div>
        </div>
      </div>
    </>
  );
}