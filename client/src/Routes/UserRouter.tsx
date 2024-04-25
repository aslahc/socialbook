import React, { useEffect } from 'react';
import { Route, Routes, Navigate ,useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";

import SignUp from "../pages/user/SignUp";
import Login from "../pages/user/Login";
import VerifyOtp from "../pages/user/VerifyOtp";
import Home from "../pages/user/Home";
import UserProfile from '../pages/user/UserProfile';
import EditProfile from '../components/Profile/EditProfile';
import CompleteProfile from '../pages/user/CompleteProfile';
import Forgetpass from '../pages/user/Forgetpass';
import ForgetOtp from '../pages/user/ForgetOtp';
import Changepass from '../pages/user/changepass';


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

    </Routes>
  );
}

export default UserRouter;
