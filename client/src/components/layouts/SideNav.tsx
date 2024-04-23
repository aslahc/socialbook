import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

function SideNav() {
  const navigate = useNavigate()
  const user = useSelector((state: any) => state.userDetails.user);
  console.log("sidee",user)
  return (


    <div>
    <nav className="max-w-xs md:max-w-64 ml-4 bg-teal-700 rounded-xl overflow-hidden shadow-lg h-85 flex flex-col justify-center">
      <ul className="py-10">
        <li  onClick={()=>{navigate('/home')}} className="px-4 py-4 text-white hover:bg-gray-700 cursor-pointer text-center">HOME</li>
        <li className="px-4 py-4 text-white hover:bg-gray-700 cursor-pointer text-center">MESSAGE</li>
        <li className="px-4 py-4 text-white hover:bg-gray-700 cursor-pointer text-center">EXPLORE</li>
        <li className="px-4 py-4 text-white hover:bg-gray-700 cursor-pointer text-center">COLLECTION</li>
        <li className="px-4 py-4 text-white hover:bg-gray-700 cursor-pointer text-center">NOTIFICATION</li>
        <li  onClick={()=>{navigate(`/profile/${user._id}`)}} className="px-4 py-4 text-white hover:bg-gray-700 cursor-pointer text-center">PROFILE</li>

      </ul>
    </nav>
  </div>
  )
}

export default SideNav