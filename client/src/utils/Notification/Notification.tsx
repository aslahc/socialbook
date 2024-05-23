// useSocketIO.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";

interface Notification {
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
  _id(_id: any): void;
  userData: string;
}

const useSocketIO = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<
    NotificationWithUserData[]
  >([]);
  const userData = useSelector((state: any) => state.userDetails.user || "");
  const userId = userData._id;

  useEffect(() => {
    const newSocket: Socket = io("https://www.aslah.online");
    newSocket.on("connect", () => {
      newSocket.emit("addUser", userId);
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const sendNotification = ({
    receiverId,
    senderName,
    message,
    userData,
  }: {
    receiverId: string;
    senderName: string;
    message: string;
    userData: string;
  }): void => {
    if (socket) {
      socket.emit("sendNotification", {
        receiverId,
        senderName,
        message,
        userData,
      });
    }
  };

  const getNotification = () => {
    if (socket) {
      socket.on(
        "getNotifications",
        ({ postImage, senderName, message, receiverId, userData }) => {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            {
              postImage,
              senderName,
              message,
              receiverId,
              userData,
              type: "notification",
              sourceId: { username: "", profileimg: "" },
            } as NotificationWithUserData,
          ]);
        }
      );
    }
  };

  return {
    socket,
    sendNotification,
    getNotification,
    notifications,
    setNotifications,
  };
};

export default useSocketIO;
