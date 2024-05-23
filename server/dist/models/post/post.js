"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_1 = __importDefault(require("../user/user"));
const PostSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_1.default,
        required: true
    },
    postUrl: [{
            type: String,
            required: false,
        }],
    caption: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    comments: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    reportCount: {
        type: Number, // Changed 'number' to 'Number'
        default: 0
    },
    isReport: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
const Post = (0, mongoose_1.model)('Post', PostSchema);
exports.default = Post;
