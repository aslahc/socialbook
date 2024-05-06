const socketIo_Config = (io: any) => {
  let users: { userId: string; socketId: string }[] = [];

  // console.log(users, "Initial users array");

  io.on("connect", (socket: any) => {
    console.log("A client connected");
    io.emit("welcome", "Welcome to the server!"); // Emit a welcome message to the client upon connection

    socket.on("disconnect", () => {
      // console.log("A client disconnected");
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
      addUser(userId, socket.id); // Add user to the users array
      // console.log(users, "Updated users array");
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
        console.log("Message sent by:", senderId);
        console.log("Message received by:", receiverId);
        console.log("timestam in soct",timestamp)
        // console.log("Message:", text);
        // console.log("Message type:", messageType);

        const user = getUser(receiverId);
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
          // console.log("Receiver not found for userId:", receiverId);
          // Handle case where receiver is not found (optional)
        }
      }
    );
  });
};

export default socketIo_Config;
