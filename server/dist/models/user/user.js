"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define user schema
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fname: { type: String },
    lname: { type: String },
    bio: { type: String },
    dob: { type: String },
    profileimg: { type: String },
    bannerImg: { type: String },
    profession: { type: String, },
    phone: { type: String, required: false }, // New field with required configuration
    followers: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    following: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    savedPost: [{
            post: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' },
            category: { type: String } // Include the category name along with the post ID
        }],
    savePostCategory: [{
            type: String,
            default: []
        }],
    isBlock: { type: Boolean, default: false },
    createdOn: {
        type: Date,
        default: Date.now
    },
    isAdmin: { type: Boolean, default: false },
});
// Export user model
exports.default = (0, mongoose_1.model)('User', userSchema);
