// Chat.tsx
import React, { useEffect, useRef, useState } from 'react';
import Conversation from '../../components/chat/Conversation';
import ChatList from '../../components/chat/ChatList';
import { useSelector } from 'react-redux';
import { RootState } from '../../utils/store/store';
import { User } from '../../types/types';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '../../axios/axios';

function Chat() {
  const socket = useRef<Socket | null>(null);
  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userConversations, setUserConversations] = useState<{ [key: string]: { sentMessages: any[]; receivedMessages: any[] } }>({});

  useEffect(() => {
    socket.current = io('http://localhost:4000');

    socket.current.on('connect', () => {
      console.log('Connected to server');
    });

    socket.current.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.current.on('getMessage', ({ senderId, receiverId, text, timestamp }) => {
      console.log("gettmessage working")
      console.log(text)
      console.log(timestamp)
      setUserConversations((prevConversations) => {
        const conversationId = senderId === userId ? receiverId : senderId;
        const conversation = prevConversations[conversationId] || { sentMessages: [], receivedMessages: [] };
        const newMessage = { text, timestamp };

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

  useEffect(() => {
    if (socket.current && userId) {
      socket.current.emit('addUser', userId);
    }
  }, [userId, socket.current]);

  const sendMessage = (receiverId: string, text: string, timestamp: number) => {
    if (!socket.current || !userId) return;

    socket.current.emit('sendMessage', { senderId: userId, receiverId, text, timestamp });
    setUserConversations((prevConversations) => {
      const conversation = prevConversations[receiverId] || { sentMessages: [], receivedMessages: [] };
      return {
        ...prevConversations,
        [receiverId]: {
          ...conversation,
          sentMessages: [...conversation.sentMessages, { text, timestamp }],
        },
      };
    });
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="container mx-auto shadow-lg rounded-lg bg-white p-6 sm:p-2">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex flex-col w-full sm:w-2/5 border-r-2 sm:border-r-2 overflow-y-auto">
            <div className="mb-4 px-2">
              <input
                type="text"
                placeholder="Search chatting"
                className="py-2 px-2 rounded-full w-full shadow-inner"
              />
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
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;