import express from 'express';
const user_route = express()

import { signUp ,verifyOtp ,verifyLogin ,fetchUsers,fetchUser,resendOtp, verifyemail
    ,editprofile ,verifyEmailOtp,changepassword} from '../controllers/UserController';



import { createPost ,fetchPosts ,addLike ,removeLike , deletePost ,} from '../controllers/PostController'

import {reportPost} from '../controllers/ReportPost'
import {postComment , getComment ,deleteComment} from '../controllers/commentController'

import user from '../models/user/user';



//signup and otp functionality 

user_route.post('/signup', signUp)
user_route.post('/otpverify', verifyOtp)
user_route.post('/verifylogin', verifyLogin)
user_route.post("/verifyEmailOtp", verifyEmailOtp)
user_route.post("/changepassword", changepassword)
user_route.post("/resendOtp", resendOtp)
user_route.post("/verifyemail", verifyemail);
 

// fetch data 
user_route.get('/fetchData', fetchUsers)
user_route.get('/fetchUserData', fetchUser)

// edit profile 
user_route.post('/editprofile/:userId', editprofile);


// posts
user_route.post("/createPost",createPost)
user_route.get("/fetchPost",fetchPosts)
user_route.post('/posts/like/:id',addLike)
user_route.delete('/posts/like/:id',removeLike)
user_route.delete('/deletepost/:postId',deletePost)
user_route.post('/reportPost',reportPost)

//comment 
user_route.post('/postComment',postComment)
user_route.get('/comment/:postId',getComment)
user_route.delete('/deleteComment/:commentId',deleteComment)

export default user_route;