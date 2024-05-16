const socketIo_Config = (io: any) => {
  let users: { userId: string; socketId: string }[] = [];

  // console.log(users, "Initial users array");

  io.on("connect", (socket: any) => {
    console.log("A client connected");
    io.emit("welcome", "Welcome to the server!"); // Emit a welcome message to the client upon connection

    socket.on("disconnect", () => {
      removeUser(socket.id); // Remove disconnected user from the users array
      io.emit("getUsers", users); // Broadcast updated users array to all clients
    });

    const removeUser = (socketId: string) => {
      users = users.filter((user) => user.socketId !== socketId);
    };

    const addUser = (userId: string, socketId: string) => {
      if (!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId });
      }
    };

    const getUser = (userId: string) => {
      return users.find((user) => user.userId === userId);
    };

    // Handle 'addUser' event
    socket.on("addUser", (userId: string) => {
      console.log(1)
      console.log(userId)
      addUser(userId, socket.id); // Add user to the users array
      io.emit("getUsers", users); // Broadcast updated users array to all clients
    });

    // Handle 'sendMessage' event
    socket.on(
      "sendMessage",
      ({
        senderId,
        receiverId,
        text,
        timestamp,
        messageType,
        file,
      }: {
        senderId: string;
        receiverId: string;
        text: string;
        timestamp:number;
        messageType?: string; // Add optional messageType
        file?: string; // Add optional file
      }) => {

        const user = getUser(receiverId);
          console.log("123qwe")
        if (user) {
          // console.log("Receiver found:", user);
          io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
            timestamp,
            messageType,
            file,
          });
        } else {
          console.log("Receiver not found for userId:", receiverId);
          // Handle case where receiver is not found (optional)
        }
      }
    );

    socket.on(
      "sendNotification",
      ({
        postImage,
        receiverId,
        senderName,
        message,
        userData,
      }: {
        postImage: string;
        receiverId: string;
        senderName: string;
        message:string;
        userData:string;
      }) => {
        console.log(message);
        console.log(2)

        const user = getUser(receiverId);
        console.log("321we11111",)
        io.to(user?.socketId).emit("getNotifications", {
          postImage,
          senderName,
          message,
          receiverId,
          userData,
        });
      }
    );


    socket.on(
      "typing",
      ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        console.log(senderId,"user and reciver",receiverId)

        const user = getUser(receiverId);
        if (user) {

          io.to(user.socketId).emit("userTyping", { senderId });
        }
      }
    );

    // Listen for "stopTyping" event from client
    socket.on(
      "stopTyping",
      ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        const user = getUser(receiverId);
  
        if (user) {
          io.to(user.socketId).emit("userStopTyping", { senderId });
        }
      }
    );
    socket.on("videoCallRequest", (data: any) => {
      const emitdata = {
        roomId: data.roomId,
        senderName:data.senderName,
        senderProfile:data.senderProfile
      };
      const user = getUser(data.recieverId);
      if(user){
        io.to(user.socketId).emit("videoCallResponse", emitdata );
      }
    });


  });
};

export default socketIo_Config;
