import { Document, Types } from "mongoose";

export interface ReportInterface extends Document {
    userId:Types.ObjectId;
    postId:Types.ObjectId;
    reason:string;
    createdOn:Date;

}