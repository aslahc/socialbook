import React from 'react'
// import Navbar from '../../components/layouts/Navbare'
import Navbar from '../../components/layouts/NavBar'
import NameCard from '../../components/layouts/NameCard'
import SideNav from '../../components/layouts/SideNav'
import ProfileCard from '../../components/Profile/ProfileCard'
import CreatePost from '../../components/posts/CreatePost'

function home() {
    return (
     <div className="">
  <div className="">
    <div>

    <Navbar />
    </div>

    <div className="mt-4 flex ">
      <div className="w-72">
        <div className="h-24  ">
          <NameCard />
        </div>
        <div className="">
        <SideNav />
      </div>
      </div>

     
      <div className="flex-1 ml-4 ">
      <CreatePost />
        </div>
    </div>
  </div>
</div>

  )
}

export default home
