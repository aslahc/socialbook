import React from 'react'
import { useNavigate } from 'react-router-dom'

function AdminSIdeBar() {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 h-screen">
    <div>
      <nav className="max-w-xs md:max-w-64 ml-4 bg-indigo-400 rounded-3xl shadow-lg h-85 flex flex-col justify-center">
        <ul className="py-10">
          <li className="px-4 py-4 text-white hover:bg-indigo-600 cursor-pointer text-center rounded-lg shadow-inner transition-colors duration-300">
            Dashboard
          </li>
          <li
            onClick={() => {
              navigate(`/admin/dashboard`);
            }}
            className="px-4 py-4 text-white hover:bg-indigo-600 cursor-pointer text-center rounded-lg shadow-inner transition-colors duration-300"
          >
            Users
          </li>
          <li className="px-4 py-4 text-white hover:bg-indigo-600 cursor-pointer text-center rounded-lg shadow-inner transition-colors duration-300">
            Post
          </li>
          <li className="px-4 py-4 text-white hover:bg-indigo-600 cursor-pointer text-center rounded-lg shadow-inner transition-colors duration-300">
            Add
          </li>
          <li
            onClick={() => {
              navigate(`/admin/PostReport`);
            }}
            className="px-4 py-4 text-white hover:bg-indigo-600 cursor-pointer text-center rounded-lg shadow-inner transition-colors duration-300"
          >
            Reports
          </li>
        </ul>
      </nav>
    </div>
  </div>
  )
}

export default AdminSIdeBar