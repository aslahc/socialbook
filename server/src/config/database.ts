import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const url =
  "mongodb://aslahcholasseri:8zjovjFZOawzwqBD@ac-312hnlu-shard-00-00.qrndvrf.mongodb.net:27017,ac-312hnlu-shard-00-01.qrndvrf.mongodb.net:27017,ac-312hnlu-shard-00-02.qrndvrf.mongodb.net:27017/socialmedia?ssl=true&replicaSet=atlas-ozmy3b-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || url);
    console.log(process.env.MONGODB_URL, "ff");
    console.log("connected to mongoDB ++");
  } catch (error) {
    console.log("Error while connecting to mongoDB");
  }
};

export default connectToMongoDB;
