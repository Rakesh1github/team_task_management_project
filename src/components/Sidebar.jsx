import React, { useState } from "react";

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

  /* LOGOUT POPUP */

  const [showLogoutPopup,
    setShowLogoutPopup]
    = useState(false);

  /* CONFIRM LOGOUT */

  const handleLogout = () => {

    localStorage.clear();

    window.location.href = "/";
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

      {/* HEADER */}

      <div className="top-header">

        <div></div>

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