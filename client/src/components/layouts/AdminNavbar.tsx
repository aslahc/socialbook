import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Dispatch action to clear user data
    // localStorage.removeItem('token');
    localStorage.removeItem("admin");

    navigate("/login");
    // Additional logout logic (e.g., redirecting to login page)
  };

  return (
    <div className="flex justify-center h-32 mt-5">
      <nav className="w-11/12 md:w-full max-w-screen-lg bg-indigo-400 bg-s rounded-3xl shadow-lg overflow-hidden flex items-center px-4 py-2">
        <div className="flex-grow md:flex items-center justify-center">
          {/* Center the input on medium screens and above */}
          <div className="relative w-full max-w-screen-sm">
            <input
              type="text"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 ring-indigo-300 focus:ring-opacity-50 md:placeholder-shown:w-full md:placeholder-shown:max-w-screen-sm transition-all duration-300 border-none"
              placeholder="Search"
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-200"></span>
          </div>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleLogout}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6 mr-2" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default AdminNavbar;
