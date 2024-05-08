// Chat.tsx
import React, { useEffect, useRef, useState } from 'react';
import Conversation from '../../components/chat/Conversation';
import ChatList from '../../components/chat/ChatList';
import Navbar from '../../components/layouts/NavBar';
import NameCard from '../../components/layouts/NameCard';
import SideNav from '../../components/layouts/SideNav';
import { useSelector } from 'react-redux';
import { RootState } from '../../utils/store/store';
import { Link, useNavigate } from 'react-router-dom';

import { User } from '../../types/types';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '../../axios/axios';
import VideoCallModal from '../../components/chat/VideoCallModal';
interface EmitData {
  senderId: string;
  senderName: string;
  senderProfile: string;
  recieverId: string;
  roomId: string;
}

function Chat() {
const navigate = useNavigate();

  const socket = useRef<Socket | null>(null);
  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userConversations, setUserConversations] = useState<{ [key: string]: { sentMessages: any[]; receivedMessages: any[] } }>({});
  const [joinVideoCall,setJoinVideoCall]=useState(false);
  const [callRequestedUser,setCallRequestedUser] = useState({name:'',profile:''})
  const [videoCallJoinRoomId,setVideoCallJoinRoomId]=useState('');

  useEffect(() => {
    socket.current = io('http://localhost:4000');

    socket.current.on('connect', () => {
      console.log('Connected to server');
    });

    socket.current.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.current.on('getMessage', ({ senderId, receiverId, text, timestamp , messageType, }) => {
      console.log("got woirejng ")
      console.log(text)
      console.log(timestamp)
      console.log(messageType,"----")
      setUserConversations((prevConversations) => {
        const conversationId = senderId === userId ? receiverId : senderId;
        const conversation = prevConversations[conversationId] || { sentMessages: [], receivedMessages: [] };
        const newMessage = { text, timestamp ,messageType };

        const updatedMessages = senderId === userId
          ? [...conversation.sentMessages, newMessage]
          : [...conversation.receivedMessages, newMessage];

        return {
          ...prevConversations,
          [conversationId]: {
            sentMessages: senderId === userId ? updatedMessages : conversation.sentMessages,
            receivedMessages: senderId !== userId ? updatedMessages : conversation.receivedMessages,
          },
        };
      });
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!selectedUser) return;

        const response = await axiosInstance.get(`/messages/${userId}/${selectedUser._id}`);
        const { sentMessages, receivedMessages } = response.data;

        setUserConversations((prevConversations) => ({
          ...prevConversations,
          [selectedUser._id]: {
            sentMessages,
            receivedMessages,
          },
        }));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [userId, selectedUser]);

  const videoCall = (emitData: EmitData) => {
    if (socket.current) {
      socket.current.emit('videoCallRequest', emitData);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on('videoCallResponse', (data) => {
       
        console.log("vido call resposene heyy " ,data)

        setVideoCallJoinRoomId(data.roomId);
        setCallRequestedUser({ name: data.senderName, profile: data.senderProfile });
        setJoinVideoCall(true);
        // Optionally, you can navigate to a video call screen upon accepting the call
      });
       
      return () => {
        if (socket.current) {
          socket.current.off('videoCallResponse');
        }
      };
    }
  }, [userId, navigate]);
  const handleJoinVidoCallRoom = () => {
  navigate(`/video-call/${videoCallJoinRoomId}/${userId}`);
};

  // Emit addUser event to register the current user on socket connection
  useEffect(() => {
    if (socket.current && userId) {
      socket.current.emit('addUser', userId);
    }
  }, [userId, socket.current]);
  
   

  useEffect(() => {
    if (socket.current && userId) {
      socket.current.emit('addUser', userId);
    }
  }, [userId, socket.current]);

  const sendMessage = (receiverId: string, text: string, timestamp: number ,messageType:string) => {
    if (!socket.current || !userId) return;

    socket.current.emit('sendMessage', { senderId: userId, receiverId, text, timestamp ,messageType  });
    setUserConversations((prevConversations) => {
      const conversation = prevConversations[receiverId] || { sentMessages: [], receivedMessages: [] };
      return {
        ...prevConversations,
        [receiverId]: {
          ...conversation,
          sentMessages: [...conversation.sentMessages, { text, timestamp,messageType }],
        },
      };
    });
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="">
    <div className="">
        <div>
            <Navbar />
        </div>
        <div className="mt-4 flex ">
        <div >
<div className="h-24">
<NameCard />
</div>
<div className="">
<SideNav />

</div>
</div>
            <div className="flex-1 ml-4 ">
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50">
  <div className="container mx-auto rounded-3xl shadow-neumorphic-large">
    <div className="flex flex-col sm:flex-row justify-between bg-white p-6 sm:p-2 rounded-3xl">
      <div className="flex flex-col w-full sm:w-2/5 border-r-2 sm:border-r-2 overflow-y-auto">
      <div className="mb-4 px-2">
      <div className="relative">
  <input
    type="text"
    placeholder="Search chatting"
    className="py-2 px-4 rounded-xl w-full bg-white shadow-neumorphic-concave text-gray-800 placeholder-gray-500 border border-indigo-400"
  />
  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
    <svg
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      ></path>
    </svg>
  </div>
</div>
</div>
        <ChatList onUserSelect={handleUserSelect} />
      </div>
      {selectedUser && (
        <Conversation
          user={selectedUser}
          sendMessage={sendMessage}
          sentMessages={userConversations[selectedUser._id]?.sentMessages || []}
          receivedMessages={userConversations[selectedUser._id]?.receivedMessages || []}
          currentUserId={userId}
          videoCall={videoCall} 
        />
      )}
    </div>
  </div>
</div>
            </div>
        </div>
    </div>
    {joinVideoCall &&
                  <VideoCallModal
                  show={joinVideoCall}
                  onHide={() => setJoinVideoCall(false)}
                  onAccept={handleJoinVidoCallRoom}
                  onReject={() =>{
                    setVideoCallJoinRoomId('');
                     setJoinVideoCall(false);
                    }}
                  caller={callRequestedUser}
                />
                
              }
</div>
  );
}

export default Chat;

