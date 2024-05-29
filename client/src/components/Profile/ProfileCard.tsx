/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store/store";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { User } from "../../types/types";
import axios from "axios";
import { followUser } from "../../utils/reducers/userData";
import { followingUser } from "../../utils/reducers/userDetails";
import { unfollowingUser } from "../../utils/reducers/userDetails";
import { unfollowUser } from "../../utils/reducers/userData";
import axiosInstance from "../../axios/axios";
import { setUserDetails } from "../../utils/reducers/userDetails";
import useFollowUser from "../../utils/firendMange/firendManage";
const baseURL = axiosInstance.defaults.baseURL;

function ProfileCard({ userData }: { userData: User }) {
  const { followUserAction, unfollowUserAction } = useFollowUser();
  const dispatch = useDispatch();
  const { id } = useParams();

  const loggedUser = useSelector((state: any) => state.userDetails.user || "");
  const userId = loggedUser._id; // logged userId

  console.log("ooooooo", userData.username);
  console.log(userData);
  const [isFollowing, setIsFollowing] = useState<Boolean>(false);

  useEffect(() => {
    // Check if the logged-in user is in the followers array of userData
    if (
      userId &&
      Array.isArray(userData.followers) &&
      userData.followers.includes(userId)
    ) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [userId, userData]);
  const PostsData = useSelector((state: RootState) => state.postData.posts);
  // Filter the user's posts based on their ID
  const userPosts = PostsData.filter((post) => post.userId._id === userId);
  const handleFollow = async () => {
    await followUserAction(userData._id, userId);
  };

  const handleUnfollow = async () => {
    await unfollowUserAction(userData._id, userId);
  };

  return (
    <div className="bg-gray-200 rounded-3xl shadow-lg mx-4 max-w-screen-xl">
      {/* Banner section */}
      <div className="relative h-48 md:h-64 rounded-t-3xl overflow-hidden">
        <img
          className="h-full w-full object-cover absolute top-0 left-0"
          src={
            userData.bannerImg || "/Hero-Banner-Placeholder-Dark-1024x480.png"
          }
          alt="Banner image"
        />
        <div className="absolute bottom-0 left-0 right-0 0 h-16 flex items-center justify-between px-4">
          <h1 className="text-white  text-sm md:text-lg font-medium">
            {userData.profession || "Add profession"}
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
              {userData.fname || "add name "} {userData.lname}
            </h1>
            <span className="text-gray-500 text-xs md:text-sm">
              @{userData.username}
            </span>
          </div>
        </div>
        <div className="flex justify-end mr-4">
          {id !== userId ? (
            isFollowing ? (
              <button
                onClick={handleUnfollow}
                className="follow-btn bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="follow-btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
              >
                Follow
              </button>
            )
          ) : (
            <Link
              className="text-end font-mono text-neutral-700 font-bold mt-2 md:mt-0 hover:text-indigo-600 transition-colors duration-300"
              to={`/editprofile/${userData._id}`}
            >
              Edit Profile
            </Link>
          )}
        </div>

        {/* Bio section */}
        <div className="mt-2">
          <p className="text-gray-600 text-sm md:text-base">
            {userData.bio || "Add bio "}
          </p>
        </div>
        <ul className="flex flex-wrap justify-center md:justify-start px-4 py-2 divide-x divide-gray-200">
          <li className="px-3 py-2 flex items-center space-x-2">
            <span className="text-gray-500 text-xs md:text-sm">Posts</span>
            <span className="font-medium text-xs md:text-base">
              {userPosts.length}
            </span>
          </li>
          <li className="px-3 py-2 flex items-center space-x-2">
            <span className="text-gray-500 text-xs md:text-sm">Following</span>
            <span className="font-medium text-xs md:text-base">
              {userData.following?.length || 0}
            </span>
          </li>
          <li className="px-3 py-2 flex items-center space-x-2">
            <span className="text-gray-500 text-xs md:text-sm">Followers</span>
            <span className="font-medium text-xs md:text-base">
              {userData.followers?.length || 0}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileCard;
