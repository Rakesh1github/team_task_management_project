import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/api";
import "../styles/MemberProjects.css";

const DEFAULT_PROJECTS = [
  { id: "def-1", name: "Discuss", description: "Team communication and discussion forums", totalTasks: 12 },
  { id: "def-2", name: "S3 Connectors", description: "AWS S3 integration and file management", totalTasks: 8 },
  { id: "def-3", name: "Calendar", description: "Company-wide event scheduling and tracking", totalTasks: 24 },
  { id: "def-4", name: "Transfers", description: "Internal asset and department transfers", totalTasks: 5 },
  { id: "def-5", name: "Talos", description: "Core system architecture and load balancing", totalTasks: 42 },
  { id: "def-6", name: "Atlas", description: "Global mapping and analytics dashboard", totalTasks: 18 },
  { id: "def-7", name: "Contacts", description: "Centralized client and employee directory", totalTasks: 3 },
  { id: "def-8", name: "Resignation", description: "Automated offboarding workflow management", totalTasks: 7 },
  { id: "def-9", name: "API Gateway", description: "Microservices routing and rate limiting", totalTasks: 31 },
  { id: "def-10", name: "Invoicing", description: "Automated billing and invoice generation", totalTasks: 15 },
  { id: "def-11", name: "Timesheets", description: "Employee time tracking and approvals", totalTasks: 9 },
  { id: "def-12", name: "WhatsApp Groups", description: "Automated group creation and syncing", totalTasks: 11 }
];

const MemberProjects = () => {
  const [fetchedProjects, setFetchedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await fetch(`${BASE_URL}/member-features/projects/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(response.ok){
        const data = await response.json();
        setFetchedProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const allProjects = [...DEFAULT_PROJECTS, ...fetchedProjects];
  const filteredProjects = allProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="member-projects">
      {/* HEADER & SEARCH */}
      <div className="project-header">
        <div className="header-titles">
          <h2>My Projects</h2>
          <p>View and explore all modules and projects assigned to you.</p>
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
                  <div className="card-icon member-icon">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="card-body">
                  <h3>{project.name}</h3>
                  <p className="card-desc">{project.description}</p>
                </div>
                <div className="card-footer">
                  <div className="stat">
                    <span className="stat-value">{project.totalTasks || 0}</span>
                    <span className="stat-label">Total Tasks</span>
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
    </div>
  );
};

export default MemberProjects;