import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate, Link } from "react-router-dom";
import {BASE_URL} from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();
      
      if (!response.ok || !data.token) {
        setError("Invalid Email or Password");
        return;
      }

      localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.id);
  localStorage.setItem("role", data.role);
  localStorage.setItem("name", data.name);
  localStorage.setItem("email", data.email);
  
      // Save login data
      
//       if (data.token) {
//   window.location.href = "/dashboard";
// }

if (data.token) {

  if(data.role === "ADMIN"){
      window.location.href = "/team-dashboard";
  }
  else{
      window.location.href = "/dashboard";
  }

}

    } catch (err) {
      console.error("Login failed:", err);
      setError("Server Error. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="card">

        <div className="card-head">
          <h2>Team Task Manager</h2>
          <p className="subtitle">Welcome Back, Login to your account</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>

          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit">
            Login
          </button>

        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "5px",
            marginTop: "20px"
          }}
        >
          <span>Don't have an account?</span>
          <Link to="/signup">Sign up</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
