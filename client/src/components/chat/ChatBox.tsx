// import React, { useEffect, useState, useRef } from "react";
// import axiosInstance from '../../axios/axios';
// import { format } from "timeago.js";
// import InputEmoji from 'react-input-emoji';

// const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
//   const [userData, setUserData] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   const scroll = useRef(null);
//   const imageRef = useRef(null);

//   const handleChange = (text) => {
//     setNewMessage(text);
//   };

//   // Fetch user data for chat header
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const userId = chat?.members?.find((id) => id !== currentUser);
//         const response = await axiosInstance.get(`/user/${userId}`);
//         setUserData(response.data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     if (chat !== null) {
//       fetchUserData();
//     }
//   }, [chat, currentUser]);

//   // Fetch chat messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axiosInstance.get(`/messages/${chat._id}`);
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     if (chat !== null) {
//       fetchMessages();
//     }
//   }, [chat]);

//   // Scroll to last message on messages update
//   useEffect(() => {
//     scroll.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Send message
//   const handleSend = async () => {
//     if (!newMessage.trim()) return; // Don't send empty messages

//     const message = {
//       senderId: currentUser,
//       text: newMessage,
//       chatId: chat._id,
//     };

//     const receiverId = chat.members.find((id) => id !== currentUser);
//     setSendMessage({ ...message, receiverId });

//     try {
//       const response = await axiosInstance.post(`/messages`, message);
//       setMessages([...messages, response.data]);
//       setNewMessage(""); // Clear input after sending message
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   // Handle received message from parent component
//   useEffect(() => {
//     if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
//       setMessages([...messages, receivedMessage]);
//     }
//   }, [receivedMessage, chat._id, messages]);

//   return (
//     <div className="ChatBox-container">
//       {chat ? (
//         <>
//           {/* Chat header */}
//           <div className="chat-header">
//             <div className="follower">
//               <div>
//                 <img
//                   src={userData?.profileimg || process.env.REACT_APP_DEFAULT_PROFILE_IMAGE}
//                   alt="Profile"
//                   className="followerImage"
//                   style={{ width: "50px", height: "50px" }}
//                 />
//                 <div className="name" style={{ fontSize: "0.9rem" }}>
//                   <span>{userData?.fname} {userData?.lname}</span>
//                 </div>
//               </div>
//             </div>
//             <hr style={{ width: "95%", border: "0.1px solid #ececec", marginTop: "20px" }} />
//           </div>

//           {/* Chat body */}
//           <div className="chat-body">
//             {messages.map((message) => (
//               <div
//                 key={message._id}
//                 className={message.senderId === currentUser ? "message own" : "message"}
//               >
//                 <span>{message.text}</span>
//                 <span>{format(message.createdAt)}</span>
//               </div>
//             ))}
//             <div ref={scroll} />
//           </div>

//           {/* Chat sender */}
//           <div className="chat-sender">
//             <div onClick={() => imageRef.current.click()}>+</div>
//             <InputEmoji value={newMessage} onChange={handleChange} />
//             <div className="send-button button" onClick={handleSend}>Send</div>
//             <input type="file" style={{ display: "none" }} ref={imageRef} />
//           </div>
//         </>
//       ) : (
//         <span className="chatbox-empty-message">Tap on a chat to start conversation...</span>
//       )}
//     </div>
//   );
// };

// export default ChatBox;
import React from 'react'

function ChatBox() {
  return (
    <div>ChatBox</div>
  )
}

export default ChatBox