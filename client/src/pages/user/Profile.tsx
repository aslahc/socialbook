import React from "react";
import ProfileCard from "../../components/Profile/ProfileCard";
import Navbar from "../../components/layouts/NavBar";
import NameCard from "../../components/layouts/NameCard";
import SideNav from "../../components/layouts/SideNav";
import Post from "../../components/posts/Post";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store/store";

// import Navbar from '../../components/layouts/Navbar'
import { IPost } from "../../types/types";

function UserProfile() {
  const userData = useSelector((state: any) => state.userDetails.user || "");

  const _id = userData._id;
  const PostsData = useSelector((state: RootState) => state.postData.posts);
  // Filter the user's posts based on their ID
  const userPosts = PostsData.filter((post) => post.userId._id === _id);

  //

  return (
    <div className="">
      <div className="">
        <div>
          <Navbar />
        </div>

        <div className="mt-4 flex ">
          <div className="w-64">
            <div className="mt-4">
              <SideNav />
            </div>
          </div>

          <div className="flex-1 ml-4 ">
            <ProfileCard userData={userData} />
            {userPosts &&
              userPosts.map((post) => <Post key={post._id} post={post} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
