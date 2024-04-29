import React from 'react';
import { Route, Routes , Navigate ,useNavigate } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import CompleteProfile from '../pages/user/CompleteProfile';
import AdminEditUser from '../pages/admin/AdminEditUser';
import ReportPostManage from '../pages/admin/ReportPostManage'

function AdminRouter() {
 const navigate = useNavigate()

const isAdmin  = localStorage.getItem('admin')
console.log(isAdmin,"havooo")
    
  return (
    <Routes>
      <Route path="/dashboard" element={isAdmin ? <Dashboard /> : <Navigate to='/login' />} />
      {/* <Route path="/admin/" element={<CompleteProfile />} /> */}
      <Route path="/user/:id" element={isAdmin ? <AdminEditUser />: <Navigate to='/login' />} />
      <Route path='/PostReport' element={isAdmin ? <ReportPostManage /> : <Navigate to='/login' />} />


    </Routes>
  );
}

export default AdminRouter;
