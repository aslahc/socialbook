import React ,{useState} from 'react'
import { GoCommentDiscussion } from "react-icons/go";

import { IPost } from '../../types/types';
import axios from 'axios';
import { RootState } from '../../utils/store/store'
import { useDispatch, useSelector } from 'react-redux';
import {deletePost} from '../../utils/reducers/PostData'
import {updatePost} from '../../utils/reducers/PostData'
import { useNavigate } from 'react-router-dom';
import Comment from '../posts/Comment';
import { BsBookmarkFill, BsBookmark } from 'react-icons/bs';
import axiosInstance from '../../axios/axios'
import ReportPost from '../posts/ReportPost';
import EditPost from '../posts/EditPost';
import Slider, { Settings } from 'react-slick';
import {setUserDetails} from '../../utils/reducers/userDetails'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const baseURL = axiosInstance.defaults.baseURL;

    interface PostProps {
       post: IPost; 
      }
    
      const ReelPost: React.FC<PostProps> = ({ post }) => {
   
        const settings: Settings = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
        };
         const navigate = useNavigate()

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.userDetails.user || '');
  console.log(user,"this is -0")
  const userId = user._id
        const [liked, setLiked] = useState<boolean>(false)
        const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
        const [showReportModal,setShowReportModal]= useState<boolean>(false)
        const [ShowEditModal,setShowEditModal] =  useState<boolean>(false)
       const [deleteModal, setdeleteModal] =  useState<boolean>(false)
        const [showOptions, setShowOptions] = useState<boolean>(false);
        const [isSavedPost , setisSavedPost] = useState<Boolean>( user && user.savedPost && user.savedPost.includes(post._id))
     console.log(isSavedPost,"ju")
      const userData = useSelector((state: any) => state.userDetails.user||'');
       const UserId = userData._id  
        const date = new Date(post.createdAt);

        // Format the date as desired (e.g., "April 25, 2024, 8:01 PM")
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
         
        });
       
        // user && user.savedPost && user.savedPost.includes(post._id);

    //  console.log(post.userId)
        console.log("Formatted Date:", formattedDate);
        const handleLikeClick = async () => {
            // Send a request to your backend API to like/unlike the post
            try {
                // Example API request using fetch
                const response = await fetch(`${baseURL}/posts/like/${post._id}`, {
                    method: liked ? 'delete' : 'post', // If already liked, send a delete request to unlike, else send a post request to like
                    headers: {
                        'Content-Type': 'application/json',
                        // Include any authentication token if required
                        // 'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ userId: UserId })
                });    

                const responseData = await response.json()
                console.log(responseData)
                if (responseData.success === true) {
                   
                    dispatch(updatePost(responseData.like));
                    setLiked(!liked);
                } else {
                    // Handle error response
                    console.error('Failed to like/unlike post');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const toggleCommentModal = () => {
            setShowCommentModal(!showCommentModal);
          };
          const toggleReportModal = ()=>{
            setShowOptions(!showOptions);

      setShowReportModal(!showReportModal)

          }
          const toogleEditPost = () => {
            setShowOptions(!showOptions);

            setShowEditModal(!ShowEditModal)

          }

          const toogleDelete = () =>{
            setShowOptions(!showOptions);

            setdeleteModal(!deleteModal)
          }
          
          const toggleOptions = () => {
            setShowOptions(!showOptions);
          };

          const handleUsernameClick = () =>{
           navigate(`/user-Profile/${post.userId._id}`)
          }
          const handleDeletePost = async () => {
            try {
              const response = await axiosInstance.delete(`/deletepost/${post._id}`);
              console.log(response,"ssssss")
              if (response.data.success === true) {
                console.log('Post deleted successfully');
            dispatch( deletePost(post._id))

              } else {
                console.error('Failed to delete post');
              }
            } catch (error) {
              console.error('Error deleting post:', error);
            }
          };


       const handleSavePost =  async () =>{

        try{
          const response = await axiosInstance.post('/posts/save', {
            postId: post._id,
            userId: userId
          });
          if(response.data.success === true){
            setisSavedPost(!isSavedPost)
            dispatch(setUserDetails(response.data.user))
          }
        }catch(error){
          console.log(error)

        }
       }
       
       const handleUnSavePost = async () =>{

        try{
               console.log("eter to undave")
          const response = await axiosInstance.post('/posts/Unsave', {
            postId: post._id,
            userId: userId
          });
          if(response.data.success === true){
            setisSavedPost(!isSavedPost)
       
            dispatch(setUserDetails(response.data.user))

          }

        }catch{

        }
       }





    return (
        <div>
        <div className="relative w-full h-full max-w-md mx-auto">
  <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2">
    <div className="flex items-center">
      <img
        src={post.userId?.profileimg || "/default-avatar.png"}
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover mr-2"
      />
      <span className="text-white font-semibold">{post.userId?.username}</span>
    </div>
  </div>

  <div className="relative h-full">
    <div className="h-[700px]">
      <video
        src={post.postUrl[0]}
        controls
        className="w-full h-full object-cover"
      ></video>
    </div>

    <div className="absolute top-0 right-0 flex flex-col items-center justify-center p-4">
      <button 
    onClick={handleLikeClick}
      
      className="text-white hover:text-gray-300 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
      <button 
onClick={toggleCommentModal}

      className="text-white hover:text-gray-300 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
      {isSavedPost ? (
        <button
          onClick={handleUnSavePost}
          className="text-white hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>
      ) : (
        <button
          onClick={handleSavePost}
          className="text-white hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z"
            />
          </svg>
        </button>
      )}
    <button
            onClick={toggleOptions}
            className="text-white hover:text-gray-300 mt-4">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
    />
  </svg>
</button>
<div className='bg-transparent'>
            {showOptions && (
  <div className="options-dropdown absolute w-36 bg-transparent rounded-md border-transparent shadow-transparent overflow-hidden shadow-xl z-10">
    {post.userId?._id === UserId ? (
  <div>
    <button  
     onClick={toogleDelete}
     className="text-red-700
      text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
    >
      Delete Post
    </button>
    <button 
    onClick={toogleEditPost} 
      className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
    >
      Edit Post
    </button>
  </div>
) : (
  <button 
    onClick={toggleReportModal}
    className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
  >
    Report Post
  </button>
)}
  </div>
)}

</div>

    </div>
  </div>
</div>
  
        {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={()=>            setdeleteModal(!deleteModal)}

              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <svg className="text-gray-400 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <p className="mb-4 text-gray-500">Are you sure you want to report this post?</p>
              <div className="flex justify-center items-center space-x-4">
                <button
                  type="button"
                 
                    onClick={()=>            setdeleteModal(!deleteModal)
}


                  className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-primary-300"
                >
                  No, cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeletePost}
     
                  className="py-2 px-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                >
                  Yes, I'm sure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        
        {showCommentModal && <Comment postId={post._id} />}
        {showReportModal && <ReportPost postId={post._id}  toggleReportModal={toggleReportModal} /> }
        {ShowEditModal && <EditPost  postId={post._id}  toogleEditPost={toogleEditPost} />}
        </div>

    )
    }

    export default ReelPost
