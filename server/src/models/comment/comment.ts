// ../models/comment/comment.ts
import { Schema, model, Document, Types } from 'mongoose';
import {ReplyCommentInterface , CommentInterface }from './commentType'

const ReplyCommentSchema = new Schema<ReplyCommentInterface>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  replyComment: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});


const CommentSchema = new Schema<CommentInterface>({
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    comment: {
      type: String,
      required: false,
    },
    createdAt :{
        type: Date,
        default: Date.now
        
    }
    // replyComments: [ReplyCommentSchema]
 
  },{timestamps:true});
  
  const Comment = model<CommentInterface>('Comment', CommentSchema);
  
  export default Comment;