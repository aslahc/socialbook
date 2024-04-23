import mongoose from "mongoose";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const connectToMongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL||"")
        console.log('connected to mongoDB')
    } catch (error) {
        console.log('Error while connecting to mongoDB',)
    }
}

export default connectToMongoDB;