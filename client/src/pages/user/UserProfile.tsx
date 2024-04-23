import React from 'react'
import ProfileCard from '../../components/Profile/ProfileCard'
import Navbar from '../../components/layouts/NavBar'
import NameCard from '../../components/layouts/NameCard'
import SideNav from '../../components/layouts/SideNav'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store'

// import Navbar from '../../components/layouts/Navbar'

function UserProfile() {
  const usersData = useSelector((state: RootState) => state.users.users);

//  console.log("use te dsssata kitteeeeeeeeeyee",usersData)

  return (
    <div className="">
  <div className="">
    <div>

    <Navbar />
    </div>

    <div className="mt-4 flex ">
      <div className="w-64">
        <div className="">
          <NameCard />
        </div>
        <div className="mt-4">
        <SideNav />
      </div>
      </div>

     
      <div className="flex-1 ml-4 ">
          <ProfileCard />
        </div>
    </div>
  </div>
</div>
  )
}

export default UserProfile