import { Document, Schema, Types } from "mongoose";


interface Comment {
    userId: Types.ObjectId;
    content: string;
    createdAt: Date;
} 

interface PostInterface extends Document {
    userId: Types.ObjectId;
    imageUrl: string;
    title: string;
    createdOn: Date;
    likes: Types.ObjectId[];
    comments:Comment[]
    isReport: boolean;
    
}

export default PostInterface;