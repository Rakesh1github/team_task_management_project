import React, { useEffect, useState } from "react";
import { BASE_URL } from "../services/api";
import "../styles/TeamManagement.css";

const TeamManagement = () => {
  const [employees, setEmployees] = useState([]);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/admin/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if(response.ok) {
      const data = await response.json();
      setEmployees(data);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    setError("");
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`${BASE_URL}/admin/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password, role })
      });

      if(response.ok) {
        setMessage("Employee Added Successfully");
        setName("");
        setEmail("");
        setPassword("");
        setRole("MEMBER");
        fetchEmployees();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to add employee");
      }
    } catch(err) {
      setError("Server error");
    }

    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  const handleRemove = async (id) => {
    if(!window.confirm("Are you sure you want to remove this employee? This will delete their assignments and attendance.")) return;
    
    const token = localStorage.getItem("token");
    await fetch(`${BASE_URL}/admin/employees/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchEmployees();
  };

  return (
    <div className="team-management-page">
      <div className="manage-header">
        <h2>Team Management</h2>
        <p>Add new employees or remove them from the system</p>
      </div>

      <div className="top-box">
        <div className="input-box">
          <label>Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
        </div>
        <div className="input-box">
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
        </div>
        <div className="input-box">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Secret password" />
        </div>
        <div className="input-box">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button className="add-member-btn" onClick={handleAddEmployee}>Create Employee</button>
      </div>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      <div className="members-table-box">
        <h3>All Employees</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
                <td>
                  {emp.email !== localStorage.getItem("email") && (
                    <button className="remove-btn" onClick={() => handleRemove(emp.id)}>Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamManagement;
