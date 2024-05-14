    import {Schema, model } from "mongoose";
    import {PostInterface} from './postType'
    import User from '../user/user'
    import CommentSchema from "../comment/comment";

    const PostSchema = new Schema<PostInterface>({
        userId: {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true
        },
        
        postUrl:[ {
            type: String,
            required: false,
        }],
        caption:{
            type: String,
            required: false,
        },
        
        createdOn: {
            type: Date,
            default: Date.now
        },
        likes: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            default: []
        },

        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        reportCount:{
            type: Number, // Changed 'number' to 'Number'
            default: 0
        },
        isReport: {
            type: Boolean,
            default: false
        },

        
    },{timestamps:true});

    const Post = model<PostInterface>('Post', PostSchema);

    export default Post;

