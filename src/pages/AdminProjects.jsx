import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/api";
import "../styles/AdminProjects.css";

const DEFAULT_PROJECTS = [
  { id: "def-1", name: "Discuss", description: "Team communication and discussion forums", totalTasks: 12, totalMembers: 5 },
  { id: "def-2", name: "S3 Connectors", description: "AWS S3 integration and file management", totalTasks: 8, totalMembers: 3 },
  { id: "def-3", name: "Calendar", description: "Company-wide event scheduling and tracking", totalTasks: 24, totalMembers: 10 },
  { id: "def-4", name: "Transfers", description: "Internal asset and department transfers", totalTasks: 5, totalMembers: 2 },
  { id: "def-5", name: "Talos", description: "Core system architecture and load balancing", totalTasks: 42, totalMembers: 8 },
  { id: "def-6", name: "Atlas", description: "Global mapping and analytics dashboard", totalTasks: 18, totalMembers: 6 },
  { id: "def-7", name: "Contacts", description: "Centralized client and employee directory", totalTasks: 3, totalMembers: 2 },
  { id: "def-8", name: "Resignation", description: "Automated offboarding workflow management", totalTasks: 7, totalMembers: 4 },
  { id: "def-9", name: "API Gateway", description: "Microservices routing and rate limiting", totalTasks: 31, totalMembers: 7 },
  { id: "def-10", name: "Invoicing", description: "Automated billing and invoice generation", totalTasks: 15, totalMembers: 3 },
  { id: "def-11", name: "Timesheets", description: "Employee time tracking and approvals", totalTasks: 9, totalMembers: 5 },
  { id: "def-12", name: "WhatsApp Groups", description: "Automated group creation and syncing", totalTasks: 11, totalMembers: 2 }
];

const AdminProjects = () => {
  const [fetchedProjects, setFetchedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFetchedProjects(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/admin/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProject = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/admin/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const openDeletePopup = (id) => {
    if(String(id).startsWith("def-")) {
      alert("Cannot delete default static projects.");
      return;
    }
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/admin/projects/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
      setShowDeletePopup(false);
      setDeleteId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteId(null);
  };

  const openEditModal = (project) => {
    if(String(project.id).startsWith("def-")) {
      alert("Cannot edit default static projects.");
      return;
    }
    setIsEdit(true);
    setShowModal(true);
    setProjectId(project.id);
    setName(project.name);
    setDescription(project.description);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setProjectId(null);
    setName("");
    setDescription("");
  };

  // Combine and Filter Projects
  const allProjects = [...DEFAULT_PROJECTS, ...fetchedProjects];
  const filteredProjects = allProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-projects">
      {/* HEADER & SEARCH */}
      <div className="project-header">
        <div className="header-titles">
          <h2>Project Dashboard</h2>
          <p>Manage and track all your modules and projects seamlessly.</p>
        </div>
        <div className="header-actions">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="create-btn" onClick={() => setShowModal(true)}>
            + New Project
          </button>
        </div>
      </div>

      {/* PROJECTS GRID */}
      {loading ? (
        <div className="loading-skeleton">
           <div className="skeleton-card"></div>
           <div className="skeleton-card"></div>
           <div className="skeleton-card"></div>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div 
                className="project-card clickable-card" 
                key={project.id} 
                onClick={() => navigate(`/tasks?project=${encodeURIComponent(project.name)}`)}
              >
                <div className="card-top">
                  <div className="card-icon">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="actions-dropdown">
                    <button className="icon-btn edit-icon" onClick={(e) => { e.stopPropagation(); openEditModal(project); }} title="Edit">✏️</button>
                    <button className="icon-btn delete-icon" onClick={(e) => { e.stopPropagation(); openDeletePopup(project.id); }} title="Delete">🗑️</button>
                  </div>
                </div>
                <div className="card-body">
                  <h3>{project.name}</h3>
                  <p className="card-desc">{project.description}</p>
                </div>
                <div className="card-footer">
                  <div className="stat">
                    <span className="stat-value">{project.totalTasks || 0}</span>
                    <span className="stat-label">Tasks</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{project.totalMembers || 0}</span>
                    <span className="stat-label">Members</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No projects found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal glass-modal">
            <h3>{isEdit ? "Edit Project" : "Create New Project"}</h3>
            <div className="input-group">
              <label>Project Name</label>
              <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea placeholder="Enter brief description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="save-btn" onClick={isEdit ? handleUpdateProject : handleCreateProject}>
                {isEdit ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE POPUP */}
      {showDeletePopup && (
        <div className="modal-overlay">
          <div className="delete-popup glass-modal">
            <div className="delete-icon-large">⚠️</div>
            <h3>Delete Project?</h3>
            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="popup-buttons">
              <button className="cancel-popup-btn" onClick={cancelDelete}>Cancel</button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;