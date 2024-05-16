import { Schema, model, Document } from 'mongoose';

// Define interface for user document

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    fname?: string;
    lname?: string;
    bio?: string;
    dob?: string;
    profileimg?: string;
    bannerImg?: string;
    profession?:string;
    phone: string; // New field
    followers?: string[];
    following?: string[];
    savedPost: { post: Schema.Types.ObjectId; category: string }[];
    savePostCategory: string[];

    isBlock?:boolean
    isAdmin?:boolean
}

// Define user schema
const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fname: { type: String },
    lname: { type: String },
    bio: { type: String },
    dob: { type: String },
    profileimg: { type: String },
    bannerImg: { type: String },
    profession:{type:String,},
    phone: { type: String, required: false }, // New field with required configuration
    followers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: [] },
    following: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
         default: [] },
         savedPost: [{
            post: { type: Schema.Types.ObjectId, ref: 'Post' },
            category: { type: String } // Include the category name along with the post ID
        }],
    savePostCategory: [{
        type: String,
        default: []
    }],
    isBlock:{type:Boolean,default:false},
    isAdmin: { type: Boolean, default: false },

});

// Export user model
export default model<IUser>('User', userSchema);
