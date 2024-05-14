import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';

const useSocketIO = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id;

  useEffect(() => {
    // Connect to the Socket.io server
    const newSocket: Socket = io('http://localhost:4000');

    newSocket.on('connect', () => {
      console.log("socket conect ayi in add Use ayakum ")
      newSocket.emit('addUser', userId);
      console.log('Socket.IO client connected to server');
    });

    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  // Define the function to send a notification
  const sendNotification = ({ receiverId, senderName, message, user }: { receiverId: string; senderName: string; message: string; user: string }): void => {
    if (socket) {
      socket.emit('sendNotification', { receiverId, senderName, message });
      console.log("enter to the send notification")
    }
  };

  const getNotification = () => {
    console.log("enter")
    if (socket) {
      socket.on('getNotifications', ({ postImage, senderName, message }) => {
        console.log("Notification received:", postImage, senderName, message);  
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { postImage, senderName, message },
        ]);
      });
    }
  };

  return { socket, sendNotification, getNotification ,notifications,setNotifications };
};

export default useSocketIO;