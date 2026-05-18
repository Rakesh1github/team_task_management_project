// src/App.jsx

import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import AuthPage from "./pages/AuthPage";

import Dashboard from "./pages/Dashboard";

import AdminProjects from "./pages/AdminProjects";
import MemberProjects from "./pages/MemberProjects";

import Layout from "./components/Layout";
import AdminTasks from "./pages/AdminTasks";
import MemberMyTasks from "./pages/MemberMyTasks";
import ManageMembers from "./pages/ManageMembers";
import TeamDashboard from "./pages/TeamDashboard";

const App = () => {

  const role = (localStorage.getItem("role") || "MEMBER").toUpperCase();

  return (

    <BrowserRouter>

      <Routes>

        {/* Login & Signup */}
        <Route
          path="/"
          element={<AuthPage initialView="login" />}
        />
        <Route
          path="/signup"
          element={<AuthPage initialView="signup" />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Projects */}

        <Route
          path="/projects"
          element={
            <Layout>

              {
                role === "ADMIN"
                  ? <AdminProjects />
                  : <MemberProjects />
              }

            </Layout>
          }
        />
        <Route
  path="/tasks"
  element={
    <Layout>

      {
        localStorage.getItem("role") === "ADMIN"
          ? <AdminTasks />
          : <MemberMyTasks />
      }

    </Layout>
  }
/>
<Route
  path="/manage-members"
  element={
    <Layout>
      {role === "ADMIN" ? <ManageMembers /> : <Navigate to="/dashboard" replace />}
    </Layout>
  }
/>
<Route
  path="/team"
  element={
    <Layout>
      {role === "ADMIN" ? <TeamDashboard /> : <Navigate to="/dashboard" replace />}
    </Layout>
  }
/>

      </Routes>

    </BrowserRouter>
  );
};

export default App;