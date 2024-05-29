import React, { useState } from "react";
import ProfileCard from "../../components/Profile/ProfileCard";
import Navbar from "../../components/layouts/NavBar";
import NameCard from "../../components/layouts/NameCard";
import SideNav from "../../components/layouts/SideNav";
import Post from "../../components/posts/Post";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store/store";

// import Navbar from '../../components/layouts/Navbar'
import { IPost } from "../../types/types";
import ReelPost from "../../components/reel/ReelPost";

function UserProfile() {
  const userData = useSelector((state: any) => state.userDetails.user || "");
  const [selectedTab, setSelectedTab] = useState("posts");
  const _id = userData._id;
  const PostsData = useSelector((state: RootState) => state.postData.posts);
  // Filter the user's posts based on their ID
  const userPosts = PostsData.filter((post) => post.userId._id === _id);
  const imagePost = userPosts.filter((post) => post.type !== "reel");
  const ReelPostData = userPosts.filter((post) => post.type === "reel");
  //

  return (
    <div className="">
      <div className="">
        <div>
          <Navbar />
        </div>

        <div className="mt-4 flex ">
          <div className="">
            <div className="">
              <SideNav />
            </div>
          </div>

          <div className="flex-1 ml-4 ">
            <ProfileCard userData={userData} />

            <div className="flex space-x-4 ml-5 mt-4 mb-2">
              <h1
                className={`cursor-pointer py-2 px-4 rounded-md ${
                  selectedTab === "posts"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setSelectedTab("posts")}
              >
                Posts
              </h1>
              <h1
                className={`cursor-pointer py-2 px-4 rounded-md ${
                  selectedTab === "reels"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setSelectedTab("reels")}
              >
                Reels
              </h1>
            </div>

            {selectedTab === "posts" &&
              imagePost.map((post) => <Post key={post._id} post={post} />)}

            {selectedTab === "reels" &&
              ReelPostData.map((post) => <ReelPost post={post} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
