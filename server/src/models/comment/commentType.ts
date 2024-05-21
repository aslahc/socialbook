import { Schema, Document, Types } from 'mongoose';


export interface ReplyCommentInterface {
  userId: Schema.Types.ObjectId | string;
  comment: string;
  timestamp: Date;
}


export interface CommentInterface extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  comment: string;
  isDeleted: boolean;
  timestamp: Date;
  createdAt:Date;
  replyComments: ReplyCommentInterface[];
}