import React, { useEffect, useState } from "react";
import { BASE_URL } from "../services/api";
import "../styles/TeamDashboard.css";

const TeamDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Panel State
  const [selectedUser, setSelectedUser] = useState(null);
  const [activityLog, setActivityLog] = useState([]);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/admin/employees/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/admin/employees/${userId}/activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(response.ok) {
        setActivityLog(await response.json());
      }
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddEmployee = async () => {
    if(!name || !email || !password) return alert("Fill all fields");
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/admin/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, email, password, role })
    });
    if(response.ok) {
      fetchDashboardData();
      setShowAddModal(false);
      setName(""); setEmail(""); setPassword("");
    } else {
      const d = await response.json();
      alert(d.message || "Failed to add employee");
    }
  };

  const handleMarkAttendance = async (userId, status) => {
    const token = localStorage.getItem("token");
    const today = new Date().toISOString().split("T")[0];
    await fetch(`${BASE_URL}/admin/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, date: today, status })
    });
    fetchDashboardData();
    if(selectedUser && selectedUser.id === userId) {
      fetchActivity(userId);
    }
  };

  const handleRemoveEmployee = async (id) => {
    if(!window.confirm("Delete this employee permanently? All their tasks and history will be lost.")) return;
    const token = localStorage.getItem("token");
    await fetch(`${BASE_URL}/admin/employees/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setSelectedUser(null);
    fetchDashboardData();
  };

  const openPanel = (user) => {
    setSelectedUser(user);
    fetchActivity(user.id);
  };

  // Derived Analytics
  const totalEmployees = dashboardData.length;
  const presentToday = dashboardData.filter(u => u.todayStatus === "PRESENT").length;
  const absentToday = dashboardData.filter(u => u.todayStatus === "ABSENT").length;
  const totalAssignments = dashboardData.reduce((acc, curr) => acc + (curr.assignedProjects ? curr.assignedProjects.length : 0), 0);

  // Filtered List
  const filteredData = dashboardData.filter(u => {
    const safeName = u.name || "";
    const safeEmail = u.email || "";
    const matchesSearch = safeName.toLowerCase().includes(searchQuery.toLowerCase()) || safeEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || (statusFilter === "PRESENT" && u.todayStatus === "PRESENT") || (statusFilter === "ABSENT" && u.todayStatus === "ABSENT") || (statusFilter === "UNMARKED" && !u.todayStatus);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="team-dashboard">
      
      <div className="dashboard-header">
        <h2>Team & Attendance Dashboard</h2>
        <p>Monitor your workforce, track live attendance, and manage project assignments.</p>
      </div>

      <div className="analytics-cards">
        <div className="stat-card">
          <span className="stat-title">Total Employees</span>
          <span className="stat-value">{totalEmployees}</span>
        </div>
        <div className="stat-card present">
          <span className="stat-title">Present Today</span>
          <span className="stat-value">{presentToday}</span>
        </div>
        <div className="stat-card absent">
          <span className="stat-title">Absent Today</span>
          <span className="stat-value">{absentToday}</span>
        </div>
        <div className="stat-card projects">
          <span className="stat-title">Active Assignments</span>
          <span className="stat-value">{totalAssignments}</span>
        </div>
      </div>

      <div className="actions-bar">
        <div className="filters">
          <input 
            type="text" 
            placeholder="🔍 Search name or email..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
          </select>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="UNMARKED">Not Marked</option>
          </select>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Add Employee</button>
      </div>

      {loading ? (
        <p>Loading team data...</p>
      ) : (
        <div className="employee-grid">
          {filteredData.map(user => (
            <div className="employee-card" key={user.id} onClick={() => openPanel(user)}>
              <div className="card-header">
                <div className="profile-info">
                  <div className="avatar">{(user.name || "?").charAt(0).toUpperCase()}</div>
                  <div className="user-details">
                    <h3>{user.name || "Unknown"}</h3>
                    <p>{user.email || "No email"} • {user.role}</p>
                  </div>
                </div>
                <div className={`status-badge ${user.todayStatus ? user.todayStatus.toLowerCase() : 'none'}`}>
                  {user.todayStatus || 'NOT MARKED'}
                </div>
              </div>
              
              <div className="card-body">
                <div className="projects-label">Current Projects ({user.assignedProjects?.length || 0})</div>
                {user.assignedProjects && user.assignedProjects.length > 0 ? (
                  <div className="project-tags">
                    {user.assignedProjects.map(p => (
                      <span key={p.id} className="project-tag">{p.name}</span>
                    ))}
                  </div>
                ) : (
                  <div className="empty-projects">No active assignments</div>
                )}
              </div>
            </div>
          ))}
          {filteredData.length === 0 && <p style={{color: '#64748b'}}>No employees found matching criteria.</p>}
        </div>
      )}

      {/* SLIDE OUT PANEL */}
      {selectedUser && (
        <div className="side-panel-overlay" onClick={() => setSelectedUser(null)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <h3>Employee Profile</h3>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
            </div>
            <div className="panel-content">
              <div className="panel-section">
                <h4>{selectedUser.name}</h4>
                <p style={{fontSize: '14px', color: '#64748b', marginBottom: '20px'}}>{selectedUser.email}</p>
                
                <h4 style={{marginTop: '10px'}}>Mark Today's Attendance</h4>
                <div className="action-buttons">
                  <button className="mark-btn present" onClick={() => handleMarkAttendance(selectedUser.id, 'PRESENT')}>Present</button>
                  <button className="mark-btn absent" onClick={() => handleMarkAttendance(selectedUser.id, 'ABSENT')}>Absent</button>
                </div>
              </div>

              <div className="panel-section">
                <h4>Recent Activity</h4>
                <div className="activity-list">
                  {activityLog.length > 0 ? activityLog.map(act => (
                    <div className="activity-item" key={act.id}>
                      <div className="activity-dot"></div>
                      <div className="activity-details">
                        <p>{act.description}</p>
                        <span>{new Date(act.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  )) : (
                    <p style={{fontSize: '13px', color: '#94a3b8'}}>No recent activity.</p>
                  )}
                </div>
              </div>

              {selectedUser.email !== localStorage.getItem("email") && (
                 <button className="danger-btn" onClick={() => handleRemoveEmployee(selectedUser.id)}>
                   Remove Employee
                 </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="glass-modal" onClick={e => e.stopPropagation()}>
            <h3>Add New Employee</h3>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jane@example.com" />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Temporary password" />
            </div>
            <div className="input-group">
              <label>Role</label>
              <select value={role} onChange={e=>setRole(e.target.value)}>
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="save-btn" onClick={handleAddEmployee}>Create Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDashboard;
