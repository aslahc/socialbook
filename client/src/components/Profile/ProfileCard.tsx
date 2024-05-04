  import React,{useEffect} from 'react'
  import { useDispatch, useSelector } from "react-redux";
  import { RootState } from '../../utils/store/store'
  import { Link } from 'react-router-dom';
import {  useParams } from "react-router-dom";
import {User } from '../../types/types'
import axios from 'axios';

import axiosInstance from '../../axios/axios';
import {setUserDetails} from '../../utils/reducers/userDetails'
 const baseURL = axiosInstance.defaults.baseURL;


  function ProfileCard({ userData }: { userData: User }) {
    
    const dispatch = useDispatch();
    const { id } = useParams();
   

    console.log("ooooooo", userData.username);
    console.log(userData)
    console.log()
  return (
    <div className="bg-gray-200 rounded-3xl shadow-lg mx-4 max-w-screen-xl">
  {/* Banner section */}
  <div className="relative h-48 md:h-64 rounded-t-3xl overflow-hidden">
    <img
      className="h-full w-full object-cover absolute top-0 left-0"
      src={userData.bannerImg || '/Hero-Banner-Placeholder-Dark-1024x480.png'}
      alt="Banner image"
    />
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 h-16 flex items-center justify-between px-4">
      <h1 className="text-white text-sm md:text-lg font-medium">
        {userData.profession || 'Add profession'}
      </h1>
    </div>
  </div>

  {/* Profile content section */}
  <div className="flex flex-col px-4 py-4">
    <div className="flex items-center space-x-2">
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-inner">
        <img
          className="w-full h-full object-cover absolute top-0 left-0"
          src={userData.profileimg || "/download.jpeg"}
          alt="Profile picture"
        />
      </div>
      <div>
        <h1 className="text-sm md:text-lg font-medium">
          {userData.fname || 'add name '} {userData.lname}
        </h1>
        <span className="text-gray-500 text-xs md:text-sm">
          @{userData.username}
        </span>
      </div>
    </div>
    <Link
      className="text-end font-mono text-neutral-700 font-bold mt-2 md:mt-0 hover:text-indigo-600 transition-colors duration-300"
      to={`/editprofile/${userData._id}`}
    >
      Edit Profile
    </Link>

    {/* Bio section */}
    <div className="mt-2">
      <p className="text-gray-600 text-sm md:text-base">
        {userData.bio || 'Add bio '}
      </p>
    </div>
    <ul className="flex flex-wrap justify-center md:justify-start px-4 py-2 divide-x divide-gray-200">
      <li className="px-3 py-2 flex items-center space-x-2">
        <span className="text-gray-500 text-xs md:text-sm">Posts</span>
        <span className="font-medium text-xs md:text-base">0</span>
      </li>
      <li className="px-3 py-2 flex items-center space-x-2">
        <span className="text-gray-500 text-xs md:text-sm">Following</span>
        <span className="font-medium text-xs md:text-base">
          {userData.following || 0}
        </span>
      </li>
      <li className="px-3 py-2 flex items-center space-x-2">
        <span className="text-gray-500 text-xs md:text-sm">Followers</span>
        <span className="font-medium text-xs md:text-base">
          {userData.followers || 0}
        </span>
      </li>
    </ul>
  </div>
</div>
  )
}

export default ProfileCard
