  // import React, { useState } from "react";
  // import { useEffect } from "react";
  // import { useDispatch } from "react-redux";
  // const Conversation = ({ data, currentUser, online }) => {

  //   const [userData, setUserData] = useState(null)
  //   const dispatch = useDispatch()

  //   useEffect(()=> {

  //     const userId = data.members.find((id :any)=>id!==currentUser)
  //     const getUserData = async ()=> {
  //       try
  //       {
  //         const response = await axiosInstance.get(`/chat/${user._id}`);

  //         setUserData(data)
  //         dispatch({type:"SAVE_USER", data:data})
  //       }
  //       catch(error)
  //       {
  //         console.log(error)
  //       }
  //     }

  //     getUserData();
  //   }, [])
  //   return (
  //     <>
  //       <div className="follower conversation">
  //         <div>
  //           {online && <div className="online-dot"></div>}
  //           <img
  //             src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"}
  //             alt="Profile"
  //             className="followerImage"
  //             style={{ width: "50px", height: "50px" }}
  //           />
  //           <div className="name" style={{fontSize: '0.8rem'}}>
  //             <span>{userData?.firstname} {userData?.lastname}</span>
  //             <span style={{color: online?"#51e200":""}}>{online? "Online" : "Offline"}</span>
  //           </div>
  //         </div>
  //       </div>
  //       <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
  //     </>
  //   );
  // };

  // export default Conversation;
  import React from 'react';
import { User } from '../../types/types';
interface ConversationProps {
  user: User;
}

  function Conversation({ user }: ConversationProps) {
    return (
      <div className="w-full px-5 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src={user.profileimg || 'https://via.placeholder.com/150'}
            className="object-cover h-12 w-12 rounded-full shadow-lg mr-2"
            alt=""
          />
          <div>
            <div className="text-lg font-semibold">{user.username}</div>
            <span className="text-gray-500">Online</span>
          </div>
        </div>
        {/* Add buttons or actions for the conversation */}
      </div>
      {/* Render conversation messages here */}
      <div className="py-5">
        {/* Input field for typing messages */}
        <input
          className="w-full bg-gray-300 py-5 px-3 rounded-full shadow-inner"
          type="text"
          placeholder="Type your message here..."
        />
      </div>
    </div>
  );
  }
  
  export default Conversation;
  