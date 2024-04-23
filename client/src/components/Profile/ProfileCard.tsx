  import React,{useEffect} from 'react'
  import { useDispatch, useSelector } from "react-redux";
  import { RootState } from '../../utils/store'
  import { Link } from 'react-router-dom';
import {  useParams } from "react-router-dom";

import axios from 'axios';

import axiosInstance from '../../axios/axios';
import {setUserDetails} from '../../utils/reducers/userDetails'
 const baseURL = axiosInstance.defaults.baseURL;
  function ProfileCard() {
    const dispatch = useDispatch();
    const { id } = useParams();
    // useEffect(() => {
    //   fetchUser();
    // }, []);
  
    // const fetchUser = async (): Promise<void> => {
    //   try {
    //     const response = await axios.get(`${baseURL}/fetchUserData/${id}`);
    //     console.log("Response:", response.data.usersData);
    //     dispatch(setUserDetails(response.data.usersData)); // Dispatching setUsers action with correct payload
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };
    const userData = useSelector((state: any) => state.userDetails.user ||'');

    console.log("ooooooo", userData.username);
    console.log(userData)
    console.log()
  return (
    <div className="border border-gray-600 rounded-xl mx-4 overflow-hidden max-w-screen-xl">
    {/* Banner section */}
    <div className="relative h-48">
      <img
        className="h-full w-full object-cover absolute top-0 left-0"
        src={userData.bannerImg || 'https://vonex.com.au/wp-content/uploads/2021/09/MicrosoftTeams-image-6-768x259.jpg'} 

        alt="Banner image"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 h-16 flex items-center justify-between px-4">
        <h1 className="text-white text-lg font-medium">{userData.profession || 'Add profession'}</h1>
        
      </div>
    </div>

    {/* Profile content section */}
    <div className="flex flex-col px-4 py-4">
      <div className="flex items-center space-x-2">
        <img
          className="w-20 h-20 rounded-full"
          src={userData.profileimg || 'data:image/jpeg;base64,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'}
          alt="Profile picture"
        />
        <div>
          <h1 className="text-lg font-medium">{userData.fname || 'add name '} {userData.lname }</h1>
          <span className="text-gray-500 text-sm">@{userData.username}</span>
        </div>


      </div>
       <Link className='text-end font-mono text-neutral-700 font-bold' to={`/editprofile/${userData._id}`}>Edit Profile</Link>

      {/* Bio section */}
      <div className="mt-2">
        <p className="text-gray-600">{userData.bio || 'Add bio '}</p>
      </div>
      <ul className="flex flex-wrap justify-center md:justify-start px-4 py-2 divide-x divide-gray-200">
        <li className="px-3 py-2 flex items-center space-x-2">
          <span className="text-gray-500 text-sm">Posts</span>
          <span className="font-medium">0</span>
        </li>
        <li className="px-3 py-2 flex items-center space-x-2">
          <span className="text-gray-500 text-sm">Following</span>
          <span className="font-medium">{userData.following || 0}</span>
        </li>
        <li className="px-3 py-2 flex items-center space-x-2">
          <span className="text-gray-500 text-sm">Followers</span>
          <span className="font-medium">{userData.followers || 0}</span>
        </li>
      </ul>
      
    </div>

  </div>
  )
}

export default ProfileCard
