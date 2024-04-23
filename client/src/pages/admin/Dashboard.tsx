import React from 'react'
import AdminNavbar from '../../components/layouts/AdminNavbar'
import AdminSIdeBar from '../../components/layouts/AdminSIdeBar'
import NameCard from '../../components/layouts/NameCard'
import UserManagment from '../../components/Users/UserManagment'

function Dashboard() {
  
  return (
  
<div className="mt-4 flex">
  <div className="w-64">
    <div className="">
      {/* Include the NameCard component */}
      <NameCard />
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

  )
}

export default Dashboard