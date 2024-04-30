import React from 'react'
import { useNavigate } from 'react-router-dom'

function AdminSIdeBar() {
  const navigate = useNavigate()

  return (
    <div>

<div>
    <nav className="max-w-xs md:max-w-64 ml-4 bg-indigo-400 rounded-xl overflow-hidden shadow-lg h-85 flex flex-col justify-center">
      <ul className="py-10">
        <li className="px-4 py-4 text-white hover:bg-gray-700 cursor-pointer text-center">Dashboard</li>
        <li  onClick={() => {
          navigate(`/admin/dashboard`);
        }} className="px-4 py-4 text-white hover:bg-gray-700 cursor-pointer text-center">Users</li>
        <li className="px-4 py-4 text-white hover:bg-gray-700 cursor-pointer text-center">post</li>
        <li className="px-4 py-4 text-white hover:bg-gray-700 cursor-pointer text-center">Add</li>
        <li
        onClick={() => {
          navigate(`/admin/PostReport`);
        }}
        className="px-4 py-4 text-white hover:bg-gray-700 cursor-pointer text-center">Reports</li>

      </ul>
    </nav>
  </div>

    </div>
  )
}

export default AdminSIdeBar