import React ,{useState} from 'react'
import { GoCommentDiscussion } from "react-icons/go";

import { IPost } from '../../types/types';
import axios from 'axios';
import { RootState } from '../../utils/store/store'
import { useDispatch, useSelector } from 'react-redux';
import {deletePost} from '../../utils/reducers/PostData'
import Comment from './Comment';

import axiosInstance from '../../axios/axios'
import ReportPost from './ReportPost';
const baseURL = axiosInstance.defaults.baseURL;

    interface PostProps {
       post: IPost; 
      }
    
      const Post: React.FC<PostProps> = ({ post }) => {
  console.log(post,"[[[]]")
  const dispatch = useDispatch();

        const [liked, setLiked] = useState<boolean>(false)
        const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
        const [showReportModal,setShowReportModal]= useState<boolean>(false)

        const [showOptions, setShowOptions] = useState<boolean>(false);
      console.log(post.userId.username)
      const userData = useSelector((state: any) => state.userDetails.user||'');
       const UserId = userData._id  
        const date = new Date(post.createdAt);
        const postData = useSelector((state : RootState)=> state.postData.posts)

        // Format the date as desired (e.g., "April 25, 2024, 8:01 PM")
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
         
        });

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
                console.log(responseData,"'sd")
                if (responseData.success === true) {
                    console.log("kkkkk")
                    // If the request is successful, toggle the liked state
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
      setShowReportModal(!showReportModal)

          }
          
          const toggleOptions = () => {
            setShowOptions(!showOptions);
          };
          const handleDeletePost = async () => {
            try {
              const response = await axios.delete(`${baseURL}/deletepost/${post._id}`);
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

    return (
        <div>
    <div className="border   max-w-xl mx-11  mt-8 p-4 bg-white shadow-md rounded-md">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
            <span className="relative flex h-10 w-15 shrink-0 overflow-hidden  mr-4">
    <img src={post.userId.profileimg} alt="Profile Image" className="w-10 h-10 rounded-full object-cover ml-2" />
</span>
            <div>
                <h4 className="font-bold">{post.userId.username}</h4>
                <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
            </div>
            <div className="flex items-center space-x-2">
            <button 
            onClick={toggleOptions}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
                </svg>
            </button>
            <div className='bg-transparent'>
            {showOptions && (
  <div className="options-dropdown absolute w-36 bg-transparent rounded-md border-transparent shadow-transparent overflow-hidden shadow-xl z-10">
    {post.userId._id === UserId ? (
      <button  
        onClick={handleDeletePost}
        className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
      >
        Delete Post
      </button>
    ) : (
      <button 
      onClick={toggleReportModal}
        className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
      >
        Report Post
      </button>
    )}
  </div>
)}

</div>


           
            </div>
        </div>
        <img
            alt="Post content"
            className="mt-4 object-cover w-full rounded-md"
            height="400"
        
            src={post.postUrl}
            style={{ aspectRatio: "500 / 500", objectFit: "cover" }}
        />
        <p className="mt-4 text-gray-800">
          {post.caption}
            {/* <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary underline-offset-4 hover:underline h-10 px-4 py-2">
            Read more
            </button> */}
        </p>
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
            <svg
    onClick={handleLikeClick}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={liked ? "red" : "none"}
    stroke={liked ? "red" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 hover:cursor-pointer" // Adjust size as needed
  >
    <path d="M12 21.943l-1.413-1.304C5.396 16.3 2 13.225 2 9.5 2 6.42 4.42 4 7.5 4c1.582 0 3.065.916 4.5 2.5C13.435 4.916 14.918 4 16.5 4c3.08 0 5.5 2.42 5.5 5.5 0 3.725-3.396 6.8-8.587 11.139L12 21.943z"></path>
  </svg>
  <p>{post.likes.length} likes</p>


  <button
onClick={toggleCommentModal}

      className={`flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 rounded-full `}
    >
      <GoCommentDiscussion size={24} />
    </button>
  

            </div>
          
  

        </div>
        </div>
        
        {showCommentModal && <Comment postId={post._id} />}
        {showReportModal && <ReportPost postId={post._id}  toggleReportModal={toggleReportModal} /> }

        </div>

    )
    }

    export default Post
