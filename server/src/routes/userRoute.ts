import express from "express";
const user_route = express();

import {
  signUp,
  verifyOtp,
  verifyLogin,
  fetchUsers,
  fetchUser,
  resendOtp,
  verifyemail,
  editprofile,
  verifyEmailOtp,
  changepassword,
  googlelogin,
  followUser,
  unfollowUser,
  UserSuggestions,
  refreshToken,
} from "../controllers/UserController";

import {
  createPost,
  fetchPosts,
  addLike,
  removeLike,
  deletePost,
  editPost,
  savePost,
  Unsave,
  createCategory,
  getPostsByCategory,
} from "../controllers/PostController";

import { reportPost } from "../controllers/ReportPost";
import {
  postComment,
  getComment,
  deleteComment,
  replayComment,
} from "../controllers/commentController";
import {
  createStory,
  fetchStoryData,
  deleteStory,
  watchStory,
  storyViews,
} from "../controllers/storyController";
import {
  notifications,
  dismmisNotification,
} from "../controllers/notifications";

import { saveMessage, messages } from "../controllers/ChatController";

import { verifyToken, authorizeRole } from "../middleware/protectRoute";
import { isBlock } from "../middleware/IsBlock";

import user from "../models/user/user";

//signup and otp functionality

user_route.post("/signup", signUp);
user_route.post("/otpverify", verifyOtp);
user_route.post("/verifylogin", verifyLogin);
user_route.post("/verifyEmailOtp", verifyEmailOtp);
user_route.post("/changepassword", changepassword);
user_route.post("/resendOtp", resendOtp);
user_route.post("/verifyemail", verifyemail);
user_route.post("/google-login", googlelogin);

// fetch data
user_route.get("/fetchData", fetchUsers);
user_route.get("/fetchUserData", fetchUser);

// edit profile
user_route.post("/editprofile/:userId", editprofile);

// posts
user_route.post("/createPost", createPost);
user_route.get("/fetchPost", fetchPosts);
user_route.post("/posts/like/:id", addLike);
user_route.delete("/posts/like/:id", removeLike);
user_route.delete("/deletepost/:postId", deletePost);
user_route.post("/reportPost", reportPost);
user_route.put("/editPost/:postId", editPost);

//comment
user_route.post("/postComment", postComment);
user_route.get("/comment/:postId", getComment);
user_route.delete("/deleteComment/:commentId", deleteComment);
user_route.post("/replayComment", replayComment);

// story route
user_route.post("/createStory", createStory);
user_route.get("/fetchStoryData", fetchStoryData);
user_route.delete("/deleteStory/:id", deleteStory);
user_route.post("/watchStory", watchStory);
user_route.get("/stories/viewers", storyViews);

//chat route
user_route.post("/saveChat", saveMessage);
user_route.get("/messages/:userId/:receiverId", messages);

// freind management

user_route.post("/users/follow/:userId", followUser);
user_route.post("/users/unfollow/:userId", unfollowUser);

//save post

user_route.post("/posts/save", savePost);
user_route.post("/posts/Unsave", Unsave);
user_route.post("/createCategory", createCategory);
user_route.get("/Savedposts/:userId/:categoryName", getPostsByCategory);
//notification

user_route.get("/notifications/:userId", notifications);
user_route.delete("/dismiss/:id", dismmisNotification);

// user suggetion
user_route.get("/suggestions/:userId", UserSuggestions);

// refresh token
user_route.post("/refresh-token", refreshToken);

export default user_route;
