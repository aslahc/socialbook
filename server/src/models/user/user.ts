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
    followers?: number;
    following?: number;
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
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    isBlock:{type:Boolean,default:false},
    isAdmin: { type: Boolean, default: false },

});

// Export user model
export default model<IUser>('User', userSchema);
