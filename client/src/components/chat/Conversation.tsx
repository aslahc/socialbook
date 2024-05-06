import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types/types';
import axiosInstance from '../../axios/axios';

interface Message {
  sender: string;
  text: string;
  timestamp: number;
}

interface ConversationProps {
  user: User;
  sendMessage: (receiverId: string, text: string, timestamp: number) => void;
  sentMessages: Message[];
  receivedMessages: Message[];
  currentUserId: string;
}

const Conversation: React.FC<ConversationProps> = ({
  user,
  sendMessage,
  sentMessages,
  receivedMessages,
  currentUserId,
}) => {
  const [messageText, setMessageText] = useState('');
  const [sortedMessage, setSortedMessages] = useState<Message[]>([]);

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
    if (messageText.trim() !== '') {
      const timestamp = new Date().getTime();
      sendMessage(user._id, messageText, timestamp);
      saveMessage(user._id, messageText, timestamp);
      setMessageText('');
    }
  };

  const saveMessage = async (receiverId: string, messageText: string, timestamp: number): Promise<void> => {
    try {
      const response = await axiosInstance.post('/saveChat', {
        _id: currentUserId,
        reciver: user._id,
        messageText,
        timestamp,
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
                  className="object-cover h-8 w-8 rounded-full shadow-lg"
                  alt=""
                />
              )}
              <div
                className={`ml-${
                  message.sender === currentUserId ? '2' : '0'
                } bg-${message.sender === currentUserId ? 'blue-400' : 'gray-400'} text-green py-3 px-4 rounded-full shadow-lg`}
              >
                {message.text}
              </div>
              {message.sender === currentUserId && (
                <img
                  src={user.profileimg || 'https://via.placeholder.com/150'}
                  className="object-cover h-8 w-8 rounded-full shadow-lg"
                  alt=""
                />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <input
          className="w-full bg-gray-300 py-2 px-3 rounded-full shadow-inner"
          type="text"
          placeholder="Type your message here..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Conversation;