import React from 'react'
import AdminLogoCard from '../../components/layouts/AdminLogoCard'
import AdminSIdeBar from '../../components/layouts/AdminSIdeBar'
import AdminNavbar from '../../components/layouts/AdminNavbar'
import UserManagment from '../../components/Users/UserManagment'

function UsersManage() {
  return (
    <div>


        
<div className=" flex">
  <div className="w-64">
    <div className="mt-4">
      {/* Include the NameCard component */}
      <AdminLogoCard />
    </div>

    <div className="mt-4">
      {/* Include the AdminSIdeBar component */}
      <AdminSIdeBar />
    </div>
  </div>

  <div className="w-full"> 
    {/* Include the AdminNavbar component */}
    <AdminNavbar />
    <UserManagment />
  </div>
</div>
    </div>
  )
}

export default UsersManage