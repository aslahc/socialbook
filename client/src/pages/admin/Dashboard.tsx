import React from 'react'
import AdminNavbar from '../../components/layouts/AdminNavbar'
import AdminSIdeBar from '../../components/layouts/AdminSIdeBar'
// import NameCard from '../../components/layouts/NameCard'
// import UserManagment from '../../components/Users/UserManagment'
import AdminLogoCard from '../../components/layouts/AdminLogoCard'
import TotalReport from '../../components/adminDashboard/TotalReport'

function Dashboard() {
  
  return (
  
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
    <TotalReport />
  </div>
</div>

  )
}

export default Dashboard