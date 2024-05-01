import express from "express";
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import connectToMongoDB from '../src/config/database'; // Assuming this establishes MongoDB connection
import userRoute from './routes/userRoute';
import adminRoute from './routes/adminRoute';
import MongoStore from "connect-mongo";
import { requestLogger } from '../src/middleware/Reqestlog'
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/Errorhandling'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,

  })
);


declare module 'express-session' {
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

  app.use(cors({
    origin: 'http://localhost:3000',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }))


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
// Routes
app.use('/admin', adminRoute);
app.use('/', userRoute);

// Error Handler Middleware (placed after all other middleware and routes)



connectToMongoDB()
  .then(() => {
    console.log("Connected to MongoDB");


    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error while connecting to MongoDB:", error);
  });