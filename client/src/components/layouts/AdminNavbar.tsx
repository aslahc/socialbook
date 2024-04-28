import React from 'react'
import { useNavigate } from 'react-router-dom';
function AdminNavbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Dispatch action to clear user data
    // localStorage.removeItem('token');
    localStorage.removeItem('admin');

    navigate('/login')
    // Additional logout logic (e.g., redirecting to login page)
  };

  return (
    <div>

<nav className="flex items-center w-11/12 ml-8 px-7 justify-between mt-5 rounded-xl h-32 px-4 bg-indigo-400">
  <div className="hidden md:flex items-center justify-center w-full"> {/* Center the input on medium screens and above */}
    <div className="relative w-full max-w-screen-sm">
      <input
        type="text"
        className="rounded-lg pl-8 pr-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 w-full bg-gray-700 border border-transparent"
        placeholder="Search"
      />
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  </div>
  <div className="flex md:hidden items-center"> {/* Shorter search input for small screens */}
    <input
      type="text"
      className="rounded-lg pl-4 pr-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 bg-gray-700 border border-transparent"
      placeholder="Search"
    />
    <button className="text-white ml-2"> {/* Add a search icon or button for small screens if needed */}
      {/* Search icon */}
    </button>
  </div>
  <button  onClick={handleLogout}   className="bg-transparent hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
    Logout
  </button>
</nav>
    </div>
  )
}

export default AdminNavbar