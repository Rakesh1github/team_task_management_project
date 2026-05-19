import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";
import { BASE_URL } from "../services/api";

const AuthPage = ({ initialView = "login" }) => {
  const [isLogin, setIsLogin] = useState(initialView === "login");
  const navigate = useNavigate();

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("MEMBER");

  // Signup State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("MEMBER");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { data = { message: text }; }

      if (!response.ok || !data || !data.token) {
        setErrorMsg(data?.message || "Invalid Email or Password");
        setLoading(false);
        return;
      }

      if (data.role !== loginRole) {
        setErrorMsg(`Role mismatch: Account is registered as ${data.role}`);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);

      window.location.href = `${import.meta.env.BASE_URL}dashboard`;
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMsg("Network Error. Please try again.");
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          role: signupRole
        })
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { data = { message: text }; }

      if (response.ok) {
        setSuccessMsg("Account created successfully!");
        setTimeout(() => {
          setIsLogin(true);
          setLoginEmail(signupEmail);
          setSuccessMsg("");
          setLoading(false);
        }, 1500);
      } else {
        setErrorMsg(data?.message || "Signup Failed. Email may already exist.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setErrorMsg("Network Error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? "" : "show-signup"}`}>
        
        {/* Left Side: Forms */}
        <div className="auth-forms-container">
          
          {/* Login Form */}
          <div className="auth-form login-form-wrapper">
            <h1 className="auth-title">Team Task Manager</h1>
            <p className="auth-subtitle">Welcome back! Please enter your details.</p>

            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn ${loginRole === "MEMBER" ? "active" : ""}`}
                onClick={() => setLoginRole("MEMBER")}
              >
                Member Login
              </button>
              <button
                type="button"
                className={`role-btn ${loginRole === "ADMIN" ? "active" : ""}`}
                onClick={() => setLoginRole("ADMIN")}
              >
                Admin Login
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              </div>
              
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>

              {errorMsg && isLogin && <p className="auth-error">{errorMsg}</p>}
              {successMsg && isLogin && <p className="auth-success">{successMsg}</p>}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <span onClick={() => { setIsLogin(false); setErrorMsg(""); }}>Sign Up</span>
            </p>
          </div>

          {/* Signup Form */}
          <div className="auth-form signup-form-wrapper">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us to manage your team tasks efficiently.</p>
            
            <form onSubmit={handleSignup}>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your name" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Register As</label>
                <div className="role-toggle" style={{ marginBottom: "5px" }}>
                  <button
                    type="button"
                    className={`role-btn ${signupRole === "MEMBER" ? "active" : ""}`}
                    onClick={() => setSignupRole("MEMBER")}
                  >
                    Member
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${signupRole === "ADMIN" ? "active" : ""}`}
                    onClick={() => setSignupRole("ADMIN")}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {errorMsg && !isLogin && <p className="auth-error">{errorMsg}</p>}
              {successMsg && !isLogin && <p className="auth-success">{successMsg}</p>}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <span onClick={() => { setIsLogin(true); setErrorMsg(""); }}>Log In</span>
            </p>
          </div>

        </div>

        {/* Right Side: Illustration & Animated Shapes */}
        <div className="auth-illustration">
          {/* Animated Blobs */}
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
          <div className="abstract-shape shape-3"></div>

          <div className="illustration-content">
            <h2>Secure & Efficient</h2>
            <p>Empower your team with advanced task management tools.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
