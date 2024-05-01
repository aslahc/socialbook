import React from 'react';
import ProfileCard from '../../components/Profile/ProfileCard';
import Navbar from '../../components/layouts/NavBar';
import NameCard from '../../components/layouts/NameCard';
import SideNav from '../../components/layouts/SideNav';
import Post from '../../components/posts/Post';
import { useSelector } from 'react-redux';
import { RootState } from '../../utils/store/store';
import { useParams } from 'react-router-dom';

function UsersProfile() {
    const { id } = useParams();
    const users = useSelector((state: RootState) => state.users.users);

    // Find the user with the matching ID
    const userData = users.find((user) => user._id === id);
   console.log(userData,"121212123123123")
    const PostsData = useSelector((state: RootState) => state.postData.posts); 
    // Filter the user's posts based on their ID
    const userPosts = PostsData.filter((post) => post.userId._id === id);

    return (
        <div className="">
            <div className="">
                <div>
                    <Navbar />
                </div>
                <div className="mt-4 flex ">
                <div >
    <div className="h-24">
      <NameCard />
    </div>
    <div className="">
      <SideNav />
    </div>
  </div>
                    <div className="flex-1 ml-4 ">

                        {/* Only render ProfileCard if userData is defined */}
                        {userData && <ProfileCard userData={userData} />}
                        {userPosts && userPosts.map((post) => (
                            <Post key={post._id} post={post}  />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsersProfile;
