import React, { useEffect } from 'react'
import Navbar from '../../components/layouts/NavBar'
import NameCard from '../../components/layouts/NameCard'
import SideNav from '../../components/layouts/SideNav'
import useSocketIO from '../../utils/Notification/Notification'
import axiosInstance from '../../axios/axios';
import { useDispatch, useSelector } from 'react-redux';

function Notification() {
   // notifcation logic
   const userData = useSelector((state: any) => state.userDetails.user || '');
   const userId = userData._id
 
   const { getNotification ,notifications ,socket ,setNotifications} = useSocketIO();
   console.log(notifications,"poo")
   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/notifications/${userId}`);
        console.log("notification response:", response.data);
        if(response.data.succuss === true){
          console.log(response.data.notifcation)
          setNotifications(response.data.notifications);
        }
        // Handle the response data here, update state, etc.
      } catch (error) {
        console.error("Error fetching notifications:", error);  
        // Handle errors here
      }
    };
  
    fetchData();
  }, [userId]); // Make sure to include userId in the dependency array if it's being used inside useEffect
  
   useEffect(() => {
    console.log("Component mounted, fetching notifications...");
    getNotification();

    // Clean up socket listener when component unmounts
    return () => {

      if (socket) {
        socket.off('getNotifications');
      }
    };
  }, [socket]);


  console.log("123",notifications)

  return (
    <div>

<div className="bg-gray-100 min-h-screen">
    <Navbar />
    <div className="mt-4 flex ">
      <div className="">
        <div className="h-24">
          <NameCard />
        </div>
        <div className="">
          <SideNav />
        </div>
      </div>

      <div className="w-full md:w-3/4px-4">
        <div className="bg-white rounded-3xl my-1 mx-5 min-h-screen neumorphism p-6">
       
        <h1 className="text-3xl font-bold mb-6 text-indigo-500">Notifications</h1>
        {notifications.map((notification, index) => (

        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between mb-4 neumorphism">
  <div className="flex items-center">
    <div className="relative">
      <img
        src={notification.sourceId.profileimg || ''}
        alt="User Avatar"
        className="w-12 h-12 rounded-full neumorphism-concave"
      />
      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
    </div>
    <div className="ml-4">
      <p className="text-gray-800 font-bold">{notification.sourceId.username}</p>
      <p className="text-gray-600">
  {notification.type === 'follow' ? 'started following you' : notification.message}
</p>
    </div>
  </div>
  <button className="bg-blue-500 text-white rounded-md px-4 py-2 neumorphism hover:bg-blue-600">
    Follow Back
  </button>
</div>
))}
        
        </div>
      </div>
    </div>
   
  </div>
    </div>
  )
}

export default Notification