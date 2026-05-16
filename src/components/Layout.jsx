// src/components/Layout.jsx

import React from "react";

import Sidebar from "./Sidebar";

const Layout = ({ children }) => {

  return (

    <div style={{ display: "flex" }}>

      <Sidebar />

      <div className="main-content">

        {children}

      </div>

    </div>
  );
};

export default Layout;