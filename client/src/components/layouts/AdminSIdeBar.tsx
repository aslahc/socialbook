import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutConfirm from "./LogoutConfirm";
function AdminSIdeBar() {
  const handleLogout = () => {
    setShowLogoutConfirm(!showLogoutConfirm);
    // localStorage.removeItem("admin");

    // navigate("/login");
    // Additional logout logic (e.g., redirecting to login page)
  };
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<Boolean>(false);

  return (
    <div className="sticky top-0 h-screen">
      <div>
        <nav className="max-w-xs md:max-w-64 ml-4 bg-indigo-400 rounded-3xl shadow-lg h-85 flex flex-col justify-center">
          <ul className="py-10">
            <li
              onClick={() => {
                navigate(`/admin/dashboard`);
              }}
              className="px-4 py-4 text-white hover:bg-indigo-600 cursor-pointer text-center rounded-lg shadow-inner transition-colors duration-300"
            >
              Dashboard
            </li>
            <li
              onClick={() => {
                navigate(`/admin/users`);
              }}
              className="px-4 py-4 text-white hover:bg-indigo-600 cursor-pointer text-center rounded-lg shadow-inner transition-colors duration-300"
            >
              Users
            </li>
            {/* <li className="px-4 py-4 text-white hover:bg-indigo-600 cursor-pointer text-center rounded-lg shadow-inner transition-colors duration-300">
            Post
          </li>
          <li className="px-4 py-4 text-white hover:bg-indigo-600 cursor-pointer text-center rounded-lg shadow-inner transition-colors duration-300">
            Add
          </li> */}
            <li
              onClick={() => {
                navigate(`/admin/PostReport`);
              }}
              className="px-4 py-4 text-white hover:bg-indigo-600 cursor-pointer text-center rounded-lg shadow-inner transition-colors duration-300"
            >
              Reports
            </li>
            <li
              onClick={handleLogout}
              className="px-4 py-4 text-white hover:bg-indigo-600 cursor-pointer text-center rounded-lg shadow-inner transition-colors duration-300"
            >
              logount
            </li>
          </ul>
        </nav>
      </div>
      {showLogoutConfirm && (
        <LogoutConfirm onClose={() => setShowLogoutConfirm(false)} />
      )}
    </div>
  );
}

export default AdminSIdeBar;
