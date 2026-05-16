import React, { useState } from "react";
import "../styles/signup.css";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../services/api";

const Signup = () => {

  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("MEMBER");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {

    e.preventDefault();

    setMessage("");

    // Password Match Check
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {

      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
          role: selectedRole,
        }),

      });

      const data = await response.json();

      if (response.ok) {

        setMessage("Signup Successful");

        setTimeout(() => {
          navigate("/");
        }, 1000);

      } else {

        setMessage(data.message || "Signup Failed");

      }

    } catch (error) {

      setMessage("Server Error");

    }

  };

  return (

    <div className="signup-page">

      <div className="signup-box">

        <h2>Create Account</h2>

        {/* Role Toggle */}
        <div
          style={{
            display: "flex",
            marginBottom: "20px",
            gap: "10px",
          }}
        >

          <button
            type="button"
            onClick={() => setSelectedRole("ADMIN")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background:
                selectedRole === "ADMIN"
                  ? "#6c63ff"
                  : "#e0e0e0",
              color:
                selectedRole === "ADMIN"
                  ? "white"
                  : "black",
            }}
          >
            Admin
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("MEMBER")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background:
                selectedRole === "MEMBER"
                  ? "#6c63ff"
                  : "#e0e0e0",
              color:
                selectedRole === "MEMBER"
                  ? "white"
                  : "black",
            }}
          >
            Member
          </button>

        </div>

        <form className="form" onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {message && (
            <p className="error-msg">
              {message}
            </p>
          )}

          <button type="submit">
            Sign Up
          </button>

          <p className="login-text">
            Already have an account?
            <Link to="/">
              {" "}Login
            </Link>
          </p>

        </form>

      </div>

    </div>

  );

};

export default Signup;