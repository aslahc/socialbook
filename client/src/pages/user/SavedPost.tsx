import React from 'react'
import SideNav from '../../components/layouts/SideNav'
import NameCard from '../../components/layouts/NameCard'
import Navbar from '../../components/layouts/NavBar'

function SavedPost() {
  return (
    <div className="bg-gray-100 min-h-screen">
    {/* Navbar */}
    <Navbar />

    {/* Main Content */}
    <div className="mt-4 flex ">
      {/* Side Navigation and NameCard (Hidden on Mobile) */}
      <div className="">
        <div className="h-24">
          <NameCard />
        </div>
        <div className="">
          <SideNav />
        </div>
      </div>

      {/* Explore Page Content */}
      <div className="w-full md:w-3/4px-4">
        <div className="bg-white rounded-3xl my-1 mx-5 min-h-screen neumorphism p-6">
       
        <h1 className="text-3xl font-bold mb-6">Collections</h1>

          {/* Display Shuffled Posts */}
        
        </div>
      </div>
    </div>
   
  </div>
  )
}

export default SavedPost