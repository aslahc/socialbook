import React, { useEffect } from 'react';
import { Route, Routes, Navigate ,useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";

import SignUp from "../pages/user/SignUp";
import Login from "../pages/user/Login";
import VerifyOtp from "../pages/user/VerifyOtp";
import Home from "../pages/user/Home";
import UserProfile from '../pages/user/Profile';
import EditProfile from '../components/Profile/EditProfile';
import CompleteProfile from '../pages/user/CompleteProfile';
import Forgetpass from '../pages/user/Forgetpass';
import ForgetOtp from '../pages/user/ForgetOtp';
import Changepass from '../pages/user/changepass';
import UsersProfile from '../pages/user/UsersProfile'
import Chat from '../pages/user/Chat';
import Conversation from '../components/chat/Conversation';
import VideoCall from '../components/chat/VideoCall';
import Explore from '../pages/user/Explore';
import SavedPost from '../pages/user/SavedPost';
import Notification from '../pages/user/Notification';
import Reels from '../pages/user/Reels';

function UserRouter() {
 const navigate = useNavigate()
const user = useSelector((state: any) => state.userDetails.user);
const auth = localStorage.getItem('token')
const isAdmin  = localStorage.getItem('admin')

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not authenticated
      navigate('/login');
    }
  }, [user]);

  return (
    
    <Routes>
   <Route 
  path='/signup' 
  element={
    auth ? (
      isAdmin ? (
        <Navigate to='/admin/dashboard' />
      ) : (
        <Navigate to='/home' />
      )
    ) : (
      <SignUp />
    )
  } 
/>

<Route 
  path='/login' 
  element={
    isAdmin ? (
      <Navigate to='/admin/dashboard' />
    ) : auth ? (
      <Navigate to='/home' />
    ) : (
      <Login />
    )
  } 
/>
<Route 
  path='/verifyotp' 
  element={
    isAdmin ? ( 
      <Navigate to='/admin/dashboard' />
    ) : auth ? (
      <Navigate to='/home' />
    ) : (
      <VerifyOtp />
    )
  } 
/>

<Route path='/verifyEmail' element={auth ? <Navigate to='/home' /> : <Forgetpass />} />
<Route path='/verifyEmailOtp' element={auth ? <Navigate to='/home' /> : <ForgetOtp />} />
<Route path='/changepassword' element={auth ? <Navigate to='/home' /> : < Changepass />} />



      {/* <Route path='/login' element={auth  && isAdmin ?    <Navigate to='/home' />   : } /> */}
      {/* <Route path='/verifyotp' element={auth  ?    <Navigate to='/home' />  :} /> */}
      <Route path='/home' element={auth ? <Home /> : <Navigate to='/login' /> } />
      <Route path="/completeProfile" element={auth ? <CompleteProfile /> : <Navigate to='/login' />} />
      {/* Check if user exists before rendering UserProfile */}
      <Route path='/Profile/:id' element={auth ? <UserProfile /> : <Navigate to='/login' />} />
      <Route path='/editProfile/:id' element={auth ? <EditProfile /> : <Navigate to='/login' />} />
      <Route path='/user-Profile/:id' element={auth ? <UsersProfile /> : <Navigate to='/login' />} />
      <Route path='/chat' element={auth ? <Chat /> : <Navigate to='/login' />} />
      <Route path='/video-call/:roomId/:userId' element={auth ? <VideoCall /> : <Navigate to='/login' />}  />
      <Route path='/explore' element={auth ? <Explore /> : <Navigate to='/login' />}  />
      <Route path='/reel' element={auth ? <Reels /> : <Navigate to='/login' />}  />

      <Route path='/Collections' element={auth ? <SavedPost /> : <Navigate to='/login' />}  />
      <Route path='/Notification' element={auth ? <Notification /> : <Navigate to='/login' />}  />


      
    </Routes>
  );
}

export default UserRouter;
