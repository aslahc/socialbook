"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route = (0, express_1.default)();
const UserController_1 = require("../controllers/UserController");
const PostController_1 = require("../controllers/PostController");
const ReportPost_1 = require("../controllers/ReportPost");
const commentController_1 = require("../controllers/commentController");
const storyController_1 = require("../controllers/storyController");
const notifications_1 = require("../controllers/notifications");
const ChatController_1 = require("../controllers/ChatController");
const protectRoute_1 = require("../middleware/protectRoute");
//signup and otp functionality
user_route.post("/signup", UserController_1.signUp);
user_route.post("/otpverify", UserController_1.verifyOtp);
user_route.post("/verifylogin", UserController_1.verifyLogin);
user_route.post("/verifyEmailOtp", UserController_1.verifyEmailOtp);
user_route.post("/changepassword", UserController_1.changepassword);
user_route.post("/resendOtp", UserController_1.resendOtp);
user_route.post("/verifyemail", UserController_1.verifyemail);
user_route.post("/google-login", UserController_1.googlelogin);
// fetch data
user_route.get("/fetchData", protectRoute_1.verifyToken, UserController_1.fetchUsers);
user_route.get("/fetchUserData", protectRoute_1.verifyToken, UserController_1.fetchUser);
// edit profile
user_route.post("/editprofile/:userId", protectRoute_1.verifyToken, UserController_1.editprofile);
// posts
user_route.post("/createPost", PostController_1.createPost);
user_route.get("/fetchPost", PostController_1.fetchPosts);
user_route.post("/posts/like/:id", PostController_1.addLike);
user_route.delete("/posts/like/:id", PostController_1.removeLike);
user_route.delete("/deletepost/:postId", PostController_1.deletePost);
user_route.post("/reportPost", ReportPost_1.reportPost);
user_route.put("/editPost/:postId", PostController_1.editPost);
//comment
user_route.post("/postComment", commentController_1.postComment);
user_route.get("/comment/:postId", commentController_1.getComment);
user_route.delete("/deleteComment/:commentId", commentController_1.deleteComment);
user_route.post("/replayComment", commentController_1.replayComment);
// story route
user_route.post("/createStory", storyController_1.createStory);
user_route.get("/fetchStoryData", storyController_1.fetchStoryData);
user_route.delete("/deleteStory/:id", storyController_1.deleteStory);
user_route.post("/watchStory", storyController_1.watchStory);
user_route.get("/stories/viewers", storyController_1.storyViews);
//chat route
user_route.post("/saveChat", ChatController_1.saveMessage);
user_route.get("/messages/:userId/:receiverId", ChatController_1.messages);
// freind management
user_route.post("/users/follow/:userId", UserController_1.followUser);
user_route.post("/users/unfollow/:userId", UserController_1.unfollowUser);
//save post
user_route.post("/posts/save", PostController_1.savePost);
user_route.post("/posts/Unsave", PostController_1.Unsave);
user_route.post("/createCategory", PostController_1.createCategory);
user_route.get("/Savedposts/:userId/:categoryName", PostController_1.getPostsByCategory);
//notification
user_route.get("/notifications/:userId", notifications_1.notifications);
user_route.delete("/dismiss/:id", notifications_1.dismmisNotification);
// user suggetion
user_route.get("/suggestions/:userId", UserController_1.UserSuggestions);
// refresh token
user_route.post("/refresh-token", UserController_1.refreshToken);
exports.default = user_route;
