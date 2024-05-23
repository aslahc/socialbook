import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import AdminEditUser from "../pages/admin/AdminEditUser";
import ReportPostManage from "../pages/admin/ReportPostManage";
import UsersManage from "../pages/admin/UsersManage";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AdminRouter() {
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("admin");
  console.log(isAdmin, "havooo");

  return (
    <Routes>
      <Route
        path="/users"
        element={isAdmin ? <UsersManage /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/user/:id"
        element={isAdmin ? <AdminEditUser /> : <Navigate to="/login" />}
      />
      <Route
        path="/PostReport"
        element={isAdmin ? <ReportPostManage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default AdminRouter;
