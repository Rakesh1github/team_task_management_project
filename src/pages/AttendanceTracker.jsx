import React, { useEffect, useState } from "react";
import { BASE_URL } from "../services/api";
import "../styles/AttendanceTracker.css";

const AttendanceTracker = () => {
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState([]);
  
  // Mark Form States
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("PRESENT");

  // Summary Filters
  const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

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

  const fetchSummary = async () => {
    if (!monthYear) return;
    const [year, month] = monthYear.split("-");
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/admin/attendance/monthly-summary?year=${year}&month=${month}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if(response.ok) {
      const data = await response.json();
      setSummary(data);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [monthYear]);

  const handleMarkAttendance = async () => {
    if (!userId || !date || !status) {
      setError("All fields are required to mark attendance");
      return;
    }
    setError("");
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`${BASE_URL}/admin/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId: Number(userId), date, status })
      });

      if(response.ok) {
        setMessage("Attendance marked successfully");
        setUserId("");
        fetchSummary(); // Refresh summary if marking for current month
      } else {
        const data = await response.json();
        setError(data.message || "Failed to mark attendance");
      }
    } catch(err) {
      setError("Server error");
    }

    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  return (
    <div className="attendance-tracker-page">
      <div className="manage-header">
        <h2>Attendance Tracker</h2>
        <p>Mark daily attendance and view monthly summaries</p>
      </div>

      <div className="top-box">
        <div className="input-box">
          <label>Employee</label>
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div className="input-box">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="input-box">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>
        <button className="mark-btn" onClick={handleMarkAttendance}>Mark Attendance</button>
      </div>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      <div className="tracker-table-box">
        <div className="tracker-header">
          <h3>Monthly Attendance Report</h3>
          <div className="month-selector">
            <label>Select Month:</label>
            <input type="month" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} />
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Days Present</th>
              <th>Days Absent</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((record) => (
              <tr key={record.userId}>
                <td>{record.name}</td>
                <td>{record.email}</td>
                <td><span className="status-present">{record.presentDays}</span></td>
                <td><span className="status-absent">{record.absentDays}</span></td>
              </tr>
            ))}
            {summary.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#64748b' }}>No records found for this month.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTracker;
