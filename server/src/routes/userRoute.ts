import express from 'express';
const user_route = express()

import { signUp } from '../controllers/UserController';
import {verifyOtp} from '../controllers/UserController'
import {verifyLogin}from '../controllers/UserController'
import {fetchUsers} from '../controllers/UserController'
import {fetchUser} from '../controllers/UserController'
import {verifyemail} from '../controllers/UserController'
import {editprofile} from '../controllers/UserController'
import {verifyEmailOtp} from '../controllers/UserController'
import {changepassword} from '../controllers/UserController'
import {resendOtp} from '../controllers/UserController'


import user from '../models/user';



user_route.post('/signup',signUp)
user_route.post('/otpverify',verifyOtp)
user_route.post('/verifylogin',verifyLogin)
user_route.get('/fetchData',fetchUsers)
user_route.get('/fetchUserData',fetchUser)


user_route.post('/editprofile/:userId', editprofile);
user_route.post("/verifyemail",verifyemail);

user_route.post("/verifyEmailOtp",verifyEmailOtp)
user_route.post("/changepassword",changepassword)
user_route.post("/resendOtp",resendOtp)


export default user_route;