import React, { useState, useEffect } from "react";
import { GoCommentDiscussion } from "react-icons/go";

import { IPost } from "../../types/types";
import axios from "axios";
import { RootState } from "../../utils/store/store";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../../utils/reducers/PostData";
import { updatePost } from "../../utils/reducers/PostData";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import axiosInstance from "../../axios/axios";
import ReportPost from "./ReportPost";
import EditPost from "./EditPost";
import Slider, { Settings } from "react-slick";
import { setUserDetails } from "../../utils/reducers/userDetails";
import useSocketIO from "../../utils/Notification/Notification";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LikedUserList from "./LikedUserLIst";
const baseURL = axiosInstance.defaults.baseURL;

interface PostProps {
  post: IPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.userDetails.user || "");
  console.log(user, "this is -0");
  const { sendNotification } = useSocketIO();

  const userId = user._id;
  const [liked, setLiked] = useState<boolean>(false);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [ShowEditModal, setShowEditModal] = useState<boolean>(false);
  const [deleteModal, setdeleteModal] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isSavedPost, setIsSavedPost] = useState<boolean>(false);
  const [showCategory, setShowCategoryModal] = useState<boolean>(false);
  const [showLikedUser, SetshowLikedUser] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const userData = useSelector((state: any) => state.userDetails.user || "");
  const UserId = userData._id;
  const date = new Date(post.createdAt);

  // Format the date as desired (e.g., "April 25, 2024, 8:01 PM")
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hello = userData.savedPost.includes(post._id);
  console.log(userData.savedPost);
  console.log("helo", hello);
  console.log("current isSavedPost", isSavedPost);
  useEffect(() => {
    const postSaved = userData.savedPost.some(
      (savedPost: any) => savedPost.post === post._id
    );
    setIsSavedPost(postSaved);
  }, [userData, post._id]);
  // user && user.savedPost && user.savedPost.includes(post._id);

  //  console.log(post.userId)
  console.log("Formatted Date:", formattedDate);
  const handleLikeClick = async () => {
    // Send a request to your backend API to like/unlike the post
    try {
      // Example API request using fetch
      const response = await fetch(`${baseURL}/posts/like/${post._id}`, {
        method: liked ? "delete" : "post", // If already liked, send a delete request to unlike, else send a post request to like
        headers: {
          "Content-Type": "application/json",
          // Include any authentication token if required
          // 'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ userId: UserId, PostOwner: post.userId._id }),
      });

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.success === true) {
        const senderName = "John Doe"; // Replace with actual sender's name
        const message = "liked your post ";
        const receiver: string = post.userId._id;

        sendNotification({
          receiverId: receiver,
          senderName,
          message,
          userData: UserId,
        });

        dispatch(updatePost(responseData.like));
        setLiked(!liked);
      } else {
        // Handle error response
        console.error("Failed to like/unlike post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleCommentModal = () => {
    setShowCommentModal(!showCommentModal);
  };
  const toggleReportModal = () => {
    setShowOptions(!showOptions);

    setShowReportModal(!showReportModal);
  };
  const toogleEditPost = () => {
    setShowOptions(!showOptions);

    setShowEditModal(!ShowEditModal);
  };

  const toogleDelete = () => {
    setShowOptions(!showOptions);

    setdeleteModal(!deleteModal);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleUsernameClick = () => {
    navigate(`/user-Profile/${post.userId._id}`);
  };
  const handleDeletePost = async () => {
    try {
      const response = await axiosInstance.delete(`/deletepost/${post._id}`);
      console.log(response, "ssssss");
      if (response.data.success === true) {
        console.log("Post deleted successfully");
        dispatch(deletePost(post._id));
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleShowcategory = async () => {
    setShowCategoryModal(!showCategory);
  };
  const handleSavePost = async () => {
    try {
      const response = await axiosInstance.post("/posts/save", {
        postId: post._id,
        userId: userId,
        category: selectedCategory,
      });
      console.log(response);
      if (response.data.success === true) {
        dispatch(setUserDetails(response.data.user));

        // setIsSavedPost(true)
        console.log("post saved in database ");
        console.log(response.data.user);
        console.log(response);
        handleShowcategory();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnSavePost = async () => {
    try {
      console.log("eter to undave");
      const response = await axiosInstance.post("/posts/Unsave", {
        postId: post._id,
        userId: userId,
      });
      if (response.data.success === true) {
        setIsSavedPost(!isSavedPost);

        dispatch(setUserDetails(response.data.user));
      }
    } catch {}
  };

  const handleLikedUserList = async () => {
    SetshowLikedUser(!showLikedUser);
  };

  //  const <Save></Save>

  return (
    <div>
      <div className="border   max-w-xl mx-11  mt-8 p-4 bg-white shadow-md rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="relative flex h-10 w-15 shrink-0 overflow-hidden  mr-4 ">
              <img
                src={post.userId?.profileimg || "/download.jpeg"}
                alt="Profile Image"
                className="w-10 h-10 rounded-full object-cover ml-2 -z-0"
              />
            </span>
            <div>
              <h4
                onClick={handleUsernameClick}
                className="font-bold hover:cursor-pointer "
              >
                {post.userId?.username}
              </h4>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleOptions}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
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
            <div className="bg-transparent">
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
        {post.postUrl.length > 1 ? (
          <Slider {...settings}>
            {post.postUrl.map((url: any, index: number) => (
              <div key={index}>
                <img
                  src={url}
                  alt={`Post content ${index}`}
                  className="mt-4 object-cover w-full rounded-md"
                  height="400"
                  style={{ aspectRatio: "200 / 200", objectFit: "cover" }}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div>
            {post.postUrl.map((url: any, index: number) => (
              <div key={index}>
                <img
                  src={url}
                  alt={`Post content ${index}`}
                  className="mt-4 object-cover w-full rounded-md"
                  height="400"
                  style={{ aspectRatio: "200 / 200", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        )}

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
            <p onClick={handleLikedUserList} className="hover-cursor">
              {post.likes.length} likes{" "}
            </p>

            <button
              onClick={toggleCommentModal}
              className={`flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 rounded-full `}
            >
              <GoCommentDiscussion size={24} />
            </button>
          </div>
          {isSavedPost ? (
            <button
              onClick={handleUnSavePost}
              className={`flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 rounded-full `}
            >
              <BsBookmarkFill size={24} />
            </button>
          ) : (
            <button
              onClick={handleShowcategory}
              className={`flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 rounded-full `}
            >
              <BsBookmark size={24} />
            </button>
          )}
        </div>
      </div>
      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setdeleteModal(!deleteModal)}
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
              <svg
                className="text-gray-400 w-11 h-11 mb-3.5 mx-auto"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <p className="mb-4 text-gray-500">
                Are you sure you want to report this post?
              </p>
              <div className="flex justify-center items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setdeleteModal(!deleteModal)}
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

      {showCommentModal && (
        <Comment postId={post._id} toggleCommentModal={toggleCommentModal} />
      )}
      {showReportModal && (
        <ReportPost postId={post._id} toggleReportModal={toggleReportModal} />
      )}
      {ShowEditModal && (
        <EditPost postId={post._id} toogleEditPost={toogleEditPost} />
      )}
      {showLikedUser && (
        <LikedUserList
          handleLikedUserList={handleLikedUserList}
          Like={post.likes}
        />
      )}
      {showCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div className="max-w-md w-full mx-auto rounded-lg shadow-lg">
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowCategoryModal(false)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Save Post Category
              </h2>
              {userData.savePostCategory.length > 0 ? (
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="category"
                  >
                    Select Category
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Choose a category</option>
                    {userData.savePostCategory.map(
                      (category: string, index: number) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      )
                    )}
                  </select>
                  <button
                    onClick={handleSavePost}
                    className="w-full px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
                    type="button"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-gray-600 mb-4">
                    You don't have any categories yet.
                  </p>
                  <button
                    onClick={() => {
                      navigate("/Collections");
                    }}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    type="button"
                  >
                    Create Category
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
