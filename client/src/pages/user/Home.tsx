import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/layouts/NavBar';
import NameCard from '../../components/layouts/NameCard';
import SideNav from '../../components/layouts/SideNav';
import CreatePost from '../../components/posts/CreatePost';
import Post from '../../components/posts/Post';
import axiosInstance from '../../axios/axios';
import axios from 'axios';
import { setUsers } from '../../utils/reducers/userData'
import PostData, {setPost} from '../../utils/reducers/PostData'
import { RootState } from '../../utils/store/store'
import {IPost} from '../../types/types'
import ReportPost from '../../components/posts/ReportPost';
const baseURL = axiosInstance.defaults.baseURL;


function Home() {
  
  const dispatch = useDispatch();
  
  // const [posts, setPosts] = useState<IPost[]>([]);
  const postData = useSelector((state : RootState)=> state.postData.posts)
 
  // Function to fetch posts
  const fetchPosts = async (): Promise<void> => {
    try {
        const response = await fetch(`${baseURL}/fetchPost`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const responseData = await response.json();

        const sortedPosts = responseData.postData.sort((a: IPost, b: IPost) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
  
        dispatch(setPost(sortedPosts));
  
      //  setPosts(postData)
        // setPosts(responseData.postData);
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};
const fetchUser = async (): Promise<void> => {
  try {
    const response = await axios.get(`${baseURL}/fetchData`);
    console.log("Response:", response.data.usersData);
    dispatch(setUsers(response.data.usersData)); // Dispatching setUsers action with correct payload
  } catch (error) {
    console.error("Error:", error);
  }
}
useEffect(() => {
    fetchPosts();
    fetchUser();

}, [dispatch]);

 
  return (
      <div className="">
        <div className="">
          <Navbar />

          <div className="mt-4 flex">
          <div className="w-full sm:w-72">
  <div className="h-24">
    <NameCard />
  </div>
  <div className="">
    <SideNav />
  </div>
</div>

            <div className="flex-1 ml-4">
              <CreatePost />
              {postData && postData.map((post) => (
                <Post key={post._id} post={post} />
              ))}

          
            </div>
          </div>
        </div>
      </div>
  );
}

export default Home;
