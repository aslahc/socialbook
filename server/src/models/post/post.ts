import {Schema, model } from "mongoose";
import PostInterface from './postType'

const CommentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



const PostSchema = new Schema<PostInterface>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    
    createdOn: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },

    comments: [CommentSchema],
    isReport: {
        type: Boolean,
        default: false
    },

    
},{timestamps:true});

const Post = model<PostInterface>('Post', PostSchema);

export default Post;

