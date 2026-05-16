// src/pages/Projects.js
import React, { useState } from "react";
import { apiFetch } from "../services/api";
import Navbar from "../components/Sidebar";

export default function Projects() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  const createProject = async () => {
    await apiFetch(`/admin/projects?name=${name}`, "POST");
    alert("Project Created");
  };

  const addMember = async () => {
    await apiFetch(`/admin/projects/${projectId}/add-member?userId=${userId}`, "POST");
    alert("Member Added");
  };

  return (
    <>
      <Navbar />
      <div>
        <h2>Projects</h2>

        <h3>Create Project</h3>
        <input placeholder="Project Name" onChange={(e) => setName(e.target.value)} />
        <button onClick={createProject}>Create</button>

        <h3>Add Member</h3>
        <input placeholder="Project ID" onChange={(e) => setProjectId(e.target.value)} />
        <input placeholder="User ID" onChange={(e) => setUserId(e.target.value)} />
        <button onClick={addMember}>Add Member</button>
      </div>
    </>
  );
}