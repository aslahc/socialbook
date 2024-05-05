import express from 'express';
const user_route = express()

import { signUp ,verifyOtp ,verifyLogin ,fetchUsers,fetchUser,resendOtp, verifyemail
    ,editprofile ,verifyEmailOtp,changepassword,googlelogin} from '../controllers/UserController';



import { createPost ,fetchPosts ,addLike ,removeLike ,   deletePost ,editPost } from '../controllers/PostController'

import {reportPost} from '../controllers/ReportPost'
import {postComment , getComment ,deleteComment} from '../controllers/commentController'
import { createStory ,fetchStoryData ,deleteStory} from '../controllers/storyController';

import {findChat ,userChats ,  createChat } from '../controllers/ChatController'
 
import {getMessages,addMessage} from '../controllers/messageController'

import {verifyToken ,   authorizeRole} from '../middleware/protectRoute'
import {isBlock } from '../middleware/IsBlock'

import user from '../models/user/user';



//signup and otp functionality 

user_route.post('/signup', signUp)
user_route.post('/otpverify', verifyOtp)
user_route.post('/verifylogin', verifyLogin)
user_route.post("/verifyEmailOtp", verifyEmailOtp)
user_route.post("/changepassword", changepassword)
user_route.post("/resendOtp", resendOtp)
user_route.post("/verifyemail", verifyemail);
user_route.post('/google-login',googlelogin)

// fetch data 
user_route.get('/fetchData',verifyToken, fetchUsers)
user_route.get('/fetchUserData',verifyToken, fetchUser)

// edit profile 
user_route.post('/editprofile/:userId',verifyToken, editprofile);


// posts
user_route.post("/createPost",verifyToken,isBlock, createPost)
user_route.get("/fetchPost",   fetchPosts)
user_route.post('/posts/like/:id' ,addLike)
user_route.delete('/posts/like/:id' , removeLike)
user_route.delete('/deletepost/:postId', verifyToken , isBlock , deletePost)
user_route.post('/reportPost', verifyToken,isBlock, reportPost )
user_route.put('/editPost/:postId', verifyToken ,isBlock,  editPost)



//comment 
user_route.post('/postComment', verifyToken ,isBlock,  postComment)
user_route.get('/comment/:postId', verifyToken ,isBlock, getComment)
user_route.delete('/deleteComment/:commentId',isBlock, verifyToken , deleteComment)



// story route 
user_route.post('/createStory',createStory)
user_route.get('/fetchStoryData',fetchStoryData)
user_route.delete('/deleteStory/:id',deleteStory)



// chat route 

user_route.post('/chat',createChat)
user_route.get("/chat/:userId",userChats)
user_route.get('/find/:firstId/:secondId',findChat)



// message 

user_route.post("/message",addMessage)
user_route.get('/message/:chatId',getMessages)

export default user_route;