import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import connectToMongoDB from "../src/config/database"; // Assuming this establishes MongoDB connection
import userRoute from "./routes/userRoute";
import adminRoute from "./routes/adminRoute";
import MongoStore from "connect-mongo";
import { requestLogger } from "../src/middleware/Reqestlog";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/Errorhandling";
import socketIo_Config from "./socket/socket";
import { Server, Socket } from "socket.io";
import http from "http";
import database from "./config/database";

require("dotenv").config();
// dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

declare module "express-session" {
  interface Session {
    userDetails?: {
      username: string;
      email: string;
      password: string;
      phone: string;
    };
  }
}
// Middleware

app.use(
  cors({
    origin: "https://aslah.online",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

const server = http.createServer(app);
const io: Server = new Server(4000, {
  cors: { origin: "*" },
});

// Configure Socket.IO
socketIo_Config(io);
// Routes
app.use("/api/admin", adminRoute);
app.use("/api/", userRoute);

// Error Handler Middleware (placed after all other middleware and routes)

database()
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error while connecting to MongoDB:", error);
  });
