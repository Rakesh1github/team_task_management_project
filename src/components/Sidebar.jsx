import React, { useState, useEffect } from "react";

import {
  Link,
  useLocation
} from "react-router-dom";

import "../styles/Sidebar.css";

const Sidebar = () => {

  const role =
    (localStorage.getItem("role") || "MEMBER").toUpperCase();

  const name =
    localStorage.getItem("name")
    || "User";

  const location =
    useLocation();

  const [open, setOpen]
    = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* LOGOUT POPUP */

  const [showLogoutPopup,
    setShowLogoutPopup]
    = useState(false);

  /* CONFIRM LOGOUT */

  const handleLogout = () => {

    localStorage.clear();

    window.location.href = import.meta.env.BASE_URL;
  };

  return (
    <>

      {/* MOBILE MENU */}

      <div
        className="hamburger"
        onClick={() => setOpen(true)}
      >
        ☰
      </div>

      {/* OVERLAY */}

      {open && (

        <div
          className="overlay"
          onClick={() => setOpen(false)}
        ></div>

      )}

      {/* SIDEBAR */}

      <div
        className={`sidebar ${
          open ? "show" : ""
        }`}
      >

        {/* LOGO */}

        <div className="logo-section">

          <div className="logo-icon">
            ✓
          </div>

          <h2>
            Team Task Manager
          </h2>

        </div>

        {/* MENU */}

        <div className="menu">

          <div className="menu-category">Overview</div>

          <Link
            to="/dashboard"
            className={
              location.pathname ===
              "/dashboard"

              ?

              "active"

              :

              ""
            }
            onClick={() =>
              setOpen(false)
            }
          >
            🏠 Dashboard
          </Link>

          <div className="menu-category">Projects & Tasks</div>

          <Link
            to="/projects"
            className={
              location.pathname ===
              "/projects"

              ?

              "active"

              :

              ""
            }
            onClick={() =>
              setOpen(false)
            }
          >
            📁 Projects
          </Link>

          {role === "ADMIN" && (
            <>
              <div className="menu-category">Team Management</div>

              <Link
                to="/team"
                className={
                  location.pathname === "/team"
                  ? "active"
                  : ""
                }
                onClick={() => setOpen(false)}
              >
                🏢 Team Dashboard
              </Link>

              <Link
                to="/tasks"
                className={
                  location.pathname === "/tasks"
                  ? "active"
                  : ""
                }
                onClick={() => setOpen(false)}
              >
                ✅ Tasks
              </Link>

              <Link
                to="/manage-members"
                className={
                  location.pathname === "/manage-members"
                  ? "active"
                  : ""
                }
                onClick={() => setOpen(false)}
              >
                👥 Project Members
              </Link>
            </>
          )}

          {role === "MEMBER" && (

            <Link
              to="/tasks"
              className={
                location.pathname ===
                "/tasks"

                ?

                "active"

                :

                ""
              }
              onClick={() =>
                setOpen(false)
              }
            >
              📋 My Tasks
            </Link>

          )}

        </div>

        {/* LOGOUT */}

        <div className="logout">

          <button
            className="logout-btn"
            onClick={() =>
              setShowLogoutPopup(true)
            }
          >
            🚪 Logout
          </button>

        </div>

      </div>

      <div className="top-header">

        <div className="theme-toggle-container" style={{ marginLeft: "20px" }}>
          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              background: "var(--bg-nebula)",
              border: "1px solid var(--border-nebula)",
              borderRadius: "20px",
              padding: "8px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--text-stars)",
              transition: "all 0.3s ease",
              boxShadow: "var(--shadow-neon)"
            }}
          >
            {theme === "dark" ? "☀️ Day Mode" : "🌙 Night Mode"}
          </button>
        </div>

        {/* PROFILE */}

        <div className="profile-section">

          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="profile"
          />

          <div className="profile-info">

            <h4>
              {name}
            </h4>

            <p>
              {role}
            </p>

          </div>

        </div>

      </div>

      {/* LOGOUT POPUP */}

      {showLogoutPopup && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>
              Logout
            </h3>

            <p>
              Are you sure you want
              to logout?
            </p>

            <div className="popup-buttons">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowLogoutPopup(false)
                }
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={handleLogout}
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default Sidebar;