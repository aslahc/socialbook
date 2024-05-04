import { Document, Schema, Types } from "mongoose";
import { CommentInterface } from "../comment/commentType"; // Assuming you have defined the Comment interface in a separate file

export interface PostInterface extends Document {
    userId: Types.ObjectId;
    postUrl: string;
    caption: string;
    createdOn: Date;
    likes: Types.ObjectId[];
    comments: Comment[];
    reportCount:number, // Use the Comment interface here
    isReport: boolean;
}
