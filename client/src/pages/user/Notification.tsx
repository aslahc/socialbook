// Notification.tsx
import React, { useEffect } from 'react';
import Navbar from '../../components/layouts/NavBar';
import NameCard from '../../components/layouts/NameCard';
import SideNav from '../../components/layouts/SideNav';
import useSocketIO from '../../utils/Notification/Notification';
import axiosInstance from '../../axios/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../utils/store/store';

interface Notification {
  _id: string;
  postImage: string;
  senderName: string;
  message: string;
  receiverId: string;
  type: string;
  sourceId: {
    username: string;
    profileimg: string;
  };
}

interface NotificationWithUserData extends Notification {
  userData: string;
}

function Notification() {
  // Notification logic
  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id;

  const { getNotification, notifications, socket, setNotifications } = useSocketIO();

  const usersDetails = useSelector((state: RootState) => state.users.users);
// const hey =notifications[0].userData ? notifications[0].userDetails?.profileimg
  const userDetails = notifications.length > 0 && notifications[notifications.length-1].userData
    ? usersDetails.find((user) => user._id === notifications[notifications.length-1].userData)
    : null;
  console.log("userDetails ann",userDetails)
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
    }, [userId]);

  useEffect(() => {
    getNotification();

    return () => {
      if (socket) {
        socket.off('getNotifications');
      }
    };
  }, [socket, getNotification]);
  console.log("zxzx",userDetails,)
  console.log("notiffdfidjfd",notifications)

  const handleDismissNotification = async (notificationId: string) => {
    try {
      const response = await axiosInstance.delete(`/dismiss/${notificationId}`);
      if (response) {
        console.log("notifiaction deleted success")
       setNotifications((prevNotifications: any[]) =>
          prevNotifications.filter((notification) => notification._id !== notificationId)
        );
      
      }
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="mt-4 flex">
        <div>
          <div className="h-24">
            <NameCard />
          </div>
          <div>
            <SideNav />
          </div>
        </div>
        <div className="w-full md:w-3/4 px-4">
          <div className="bg-white rounded-3xl my-1 mx-5 min-h-screen neumorphism p-6">
            <h1 className="text-3xl font-bold mb-6 text-indigo-500">Notifications</h1>
            {notifications.map((notification: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between mb-4 neumorphism">
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={notification.sourceId.profileimg || (userDetails?.profileimg || '/download.jpeg')}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full neumorphism-concave"
                    />
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-800 font-bold">{notification.sourceId.username ||(userDetails?.username || '') }</p>
                    <p className="text-gray-600">
  {
    notification.type === 'follow' ? 'started following you' : 
    notification.type === 'like' ? 'liked your post' : 
    notification.message
  }
</p>
 
                  </div>
                </div>
                <button
              onClick={() => handleDismissNotification(notification._id)}
                 className="bg-red-600 text-white rounded-md px-4 py-2 neumorphism hover:bg-red-700 flex items-center">
 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 Dismiss
</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;