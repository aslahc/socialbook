"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketIo_Config = (io) => {
    let users = [];
    // console.log(users, "Initial users array");
    io.on("connect", (socket) => {
        console.log("A client connected");
        io.emit("welcome", "Welcome to the server!"); // Emit a welcome message to the client upon connection
        socket.on("disconnect", () => {
            removeUser(socket.id); // Remove disconnected user from the users array
            io.emit("getUsers", users); // Broadcast updated users array to all clients
        });
        const removeUser = (socketId) => {
            users = users.filter((user) => user.socketId !== socketId);
        };
        const addUser = (userId, socketId) => {
            if (!users.some((user) => user.userId === userId)) {
                users.push({ userId, socketId });
            }
        };
        const getUser = (userId) => {
            return users.find((user) => user.userId === userId);
        };
        // Handle 'addUser' event
        socket.on("addUser", (userId) => {
            console.log(1);
            console.log(userId);
            addUser(userId, socket.id); // Add user to the users array
            io.emit("getUsers", users); // Broadcast updated users array to all clients
        });
        // Handle 'sendMessage' event
        socket.on("sendMessage", ({ senderId, receiverId, text, timestamp, messageType, file, }) => {
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
            }
            else {
                console.log("Receiver not found for userId:", receiverId);
                // Handle case where receiver is not found (optional)
            }
        });
        socket.on("sendNotification", ({ postImage, receiverId, senderName, message, userData, }) => {
            console.log(message);
            console.log(2);
            const user = getUser(receiverId);
            io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("getNotifications", {
                postImage,
                senderName,
                message,
                receiverId,
                userData,
            });
        });
        socket.on("typing", ({ senderId, receiverId }) => {
            console.log(senderId, "user and reciver", receiverId);
            const user = getUser(receiverId);
            if (user) {
                io.to(user.socketId).emit("userTyping", { senderId });
            }
        });
        // Listen for "stopTyping" event from client
        socket.on("stopTyping", ({ senderId, receiverId }) => {
            const user = getUser(receiverId);
            if (user) {
                io.to(user.socketId).emit("userStopTyping", { senderId });
            }
        });
        socket.on("videoCallRequest", (data) => {
            const emitdata = {
                roomId: data.roomId,
                senderName: data.senderName,
                senderProfile: data.senderProfile,
            };
            const user = getUser(data.recieverId);
            if (user) {
                io.to(user.socketId).emit("videoCallResponse", emitdata);
            }
        });
    });
};
exports.default = socketIo_Config;
