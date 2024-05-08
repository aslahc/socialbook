import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types/types';
import axiosInstance from '../../axios/axios';
import axios from 'axios';
import VideoCall from './VideoCall';
import { Link, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import VideoMessage from './videoMessage';
import FileMessage from './FileMessage';
import FileChat from './FileChat';

interface Message {
  sender: string;
  text: string;
  timestamp: number;
  messageType: string
}

interface ConversationProps {
  user: User;
  sendMessage: (receiverId: string, text: string, timestamp: number ,messageType:string) => void;
  sentMessages: Message[];
  receivedMessages: Message[];
  currentUserId: string;
  videoCall: (emitData: EmitData) => void; 
}

interface EmitData {
  senderId: string;
  senderName: string;
  senderProfile: string;
  recieverId: string;
  roomId: string;
}


const Conversation: React.FC<ConversationProps> = ({
  user,
  sendMessage,
  sentMessages,
  receivedMessages,
  currentUserId,
  videoCall,
}) => {

const navigate = useNavigate();
const socket = useRef<Socket | null>(null);

  const [messageText, setMessageText] = useState('');
  const [sortedMessage, setSortedMessages] = useState<Message[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);



  const presetKey: string = 'cloudinaryimg'; 
  const cloudName: string = 'dy9ofwwjp';
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const allMessages = [
      ...sentMessages.map((msg) => ({ ...msg, sender: currentUserId })),
      ...receivedMessages.map((msg) => ({ ...msg, sender: user._id })),
    ];

    const sortedMessages = allMessages.sort((a, b) => a.timestamp - b.timestamp);
     console.log("sort wokring")
     console.log(sortedMessages)
    setSortedMessages(sortedMessages);
  }, [sentMessages, receivedMessages, currentUserId, user._id]);

  const handleSendMessage = () => {
    if (messageText.trim() !== '' || selectedImage  ) {
      let timestamp = new Date().getTime();
      if (selectedImage) {
        // Upload image to Cloudinary
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('upload_preset', presetKey);


        try {
          axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData).then(
            res =>{
               const imageUrl = res.data.secure_url
               console.log(imageUrl)
               const messageType = 'image';

               sendMessage(user._id, imageUrl, timestamp, messageType,);

              saveMessage(user._id, imageUrl, timestamp,messageType);
             
           

            }
          ).catch(err => console.log(err))

        
        } catch (error) {
          console.error('Error uploading image to Cloudinary:', error);
        }
      } else {
        const messageType = 'text';

      sendMessage(user._id, messageText, timestamp,messageType );
      saveMessage(user._id, messageText, timestamp,messageType);
      setMessageText('');
      }
    }
  };
   
  const handleImageSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // Allow only image files
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setSelectedImage(files[0]);
      }
    };
    input.click(); // Trigger the file input dialog
  };
  


  const saveMessage = async (receiverId: string, messageText: string, timestamp: number,messageType:string): Promise<void> => {
    try {
      const response = await axiosInstance.post('/saveChat', {
        _id: currentUserId,
        reciver: user._id,
        messageText,
        timestamp,
        messageType
      });

      if (response.data.success) {
        console.log(response.data.ConversationId, 'Conversation ID');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sortedMessage]);
  const closeModal = () => {

    // Clear selected image when closing modal
    setSelectedImage(null);
  };

  function randomID(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  const handleVideoCall = () => {
    const roomId = randomID(10);
    const recieverId = user._id;
    const emitData = {
      senderId: currentUserId,
      senderName: "aslah",
      senderProfile: "",
      recieverId,
      roomId: roomId,
    };
    videoCall(emitData); 

    navigate(`/video-call/${roomId}/${user._id}`);
  };
  const getFileNameFromPath = (filePath: string) => {
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  };
  return (
<div className="w-full px-5 flex flex-col justify-between bg-gradient-to-br from-indigo-50 to-pink-50 rounded-3xl shadow-neumorphic-large">
<div className="bg-white rounded-3xl shadow-neumorphic-concave p-4 ">
  <div className="flex justify-between items-center mb-4">
  <div className="flex items-center w-full"> 
      <div className="relative">
        <img
          src={user.profileimg || 'https://via.placeholder.com/150'}
          className="object-cover h-16 w-16 rounded-full shadow-neumorphic-convex"
          alt=""
        />
        <div className="absolute bottom-0 right-0 bg-green-500 rounded-full shadow-neumorphic-concave p-1">
          <div className="bg-white rounded-full p-1"></div>
        </div>
      </div>
      <div className="ml-4">
        <div className="text-xl font-semibold text-indigo-600">
          {user.username}
        </div>
        <span className="text-green-500">Online</span>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <div className="bg-white rounded-full shadow-neumorphic-convex p-3 relative">
      <svg
          onClick={handleVideoCall}
        className="w-6 h-6 text-indigo-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        ></path>
      </svg>
      {/* <VideoCall roomId={123} userId={user._id} /> */}

       
        <div className="absolute -top-1 -right-1 bg-white rounded-full shadow-neumorphic-concave p-1">
          <div className="bg-indigo-400 rounded-full p-1"></div>
        </div>
      </div>
     
    </div>
  </div>
</div>
  <div className="py-5 flex-grow overflow-y-auto">
    <div className="flex flex-col mt-5">
    {sortedMessage.map((message, index) => (
  <div
    key={index}
    className={`flex justify-${message.sender === currentUserId ? 'end' : 'start'} mb-4`}
  >
    {message.sender !== currentUserId && (
      <img
        src={user.profileimg || 'https://via.placeholder.com/150'}
        className="object-cover h-8 w-8 rounded-full shadow-neumorphic-convex"
        alt=""
      />
    )}
    <div className={`ml-${message.sender === currentUserId ? '2' : '0'} bg-white text-gray-800 py-3 px-4 rounded-full shadow-neumorphic-concave`}>
      {message.messageType === 'text' ? (
        // Render text message
        <span>{message.text}</span>
      ) : message.messageType === 'image' ? (
        // Render image message
        <img
          src={message.text}
          alt="Sent Image"
          className="max-w-[200px] h-auto rounded-lg shadow-neumorphic-convex"
        />
      ) : message.messageType === 'video' ? (
        // Render video message
        <video
          src={message.text} // Assuming message.text is the video URL
          controls
          className="max-w-[300px] h-auto rounded-lg shadow-neumorphic-convex"
        ></video>
      ) :message.messageType === 'file' ? (
        <FileChat
          fileUrl={message.text}
          fileName={getFileNameFromPath(message.text)}
        />
      ) : null}
    </div>
    {message.sender === currentUserId && (
      <img
        src={user.profileimg || 'https://via.placeholder.com/150'}
        className="object-cover h-8 w-8 rounded-full shadow-neumorphic-convex"
        alt=""
      />
    )}
  </div>
))}
      <div ref={messagesEndRef} />
    </div>
  </div>
  <div className="flex justify-between items-center mt-4">
  <div className="relative w-full">
    <input
      className="w-full bg-white py-3 px-5 rounded-lg shadow-neumorphic-convex border-2 border-transparent focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
      type="text"
      placeholder="Type your message here..."
      value={messageText}
      onChange={(e) => setMessageText(e.target.value)}
    />
    <div className="absolute inset-y-0 right-0 pl-3 flex items-center space-x-2">
      
      <svg
        className="w-6 h-6 text-indigo-400 cursor-pointer"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleImageSelect}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
    <VideoMessage saveMessage={saveMessage} sendMessage={sendMessage}    user={user} />
    <FileMessage saveMessage={saveMessage} sendMessage={sendMessage}    user={user} />
    </div>
  </div>
  <button
    className="ml-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-neumorphic-convex hover:shadow-neumorphic-concave transition-all duration-300 flex items-center"
    onClick={handleSendMessage}
  >
    <svg
      className="w-5 h-5 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 5l7 7-7 7M5 5l7 7-7 7"
      ></path>
    </svg>
    Send
  </button>
</div>
{selectedImage && (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
        <img
          src={selectedImage ? URL.createObjectURL(selectedImage) : ''}
          alt="Selected Image"
          className="max-w-full h-auto rounded-lg shadow-neumorphic-convex"
        />
        <button
          className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-neumorphic-convex hover:shadow-neumorphic-concave transition-all duration-300"
          onClick={handleSendMessage}
        >
          Send Image
        </button>
        <button
          onClick={closeModal}

        >
         sdfsas
        </button>
      </div>
    </div>
  )}
</div>
  );
};

export default Conversation;

function randomID(arg0: number) {
  throw new Error('Function not implemented.');
}
