import React, { useState } from "react";
import AdminLogoCard from "../../components/layouts/AdminLogoCard";
import AdminSIdeBar from "../../components/layouts/AdminSIdeBar";
import AdminNavbar from "../../components/layouts/AdminNavbar";
import TotalReport from "../../components/adminDashboard/TotalReport";
import Graph from "../../components/adminDashboard/Graph";
import { FaBars, FaTimes } from "react-icons/fa";
import UserManagment from "../../components/Users/UserManagment";
import AdminManageReport from "../../components/posts/AdminManageReport";
function AdminDashboard() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Toggle Button for Mobile */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-100">
        <div className="text-xl font-bold">Admin Dashboard</div>
        <button
          onClick={toggleSidebar}
          className="bg-indigo-500 text-white p-2 rounded-lg shadow-lg"
        >
          {isSidebarVisible ? "Hide Menu" : "Show Menu"}
        </button>
      </div>

      {/* Sidebar and LogoCard for Desktop and Mobile */}
      <div
        className={`w-64 md:block ${
          isSidebarVisible ? "block" : "hidden"
        } md:h-auto md:relative fixed top-0 left-0 z-50 md:z-0 bg-white shadow-lg md:shadow-none`}
      >
        <div className="mt-4">
          <AdminLogoCard />
        </div>
        <div className="mt-4">
          <AdminSIdeBar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <AdminManageReport />
      </div>
    </div>
  );
}

export default AdminDashboard;
