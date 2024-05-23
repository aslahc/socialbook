"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ../models/comment/comment.ts
const mongoose_1 = require("mongoose");
const ReplyCommentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
const CommentSchema = new mongoose_1.Schema({
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
        required: false,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    comment: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    replyComments: [ReplyCommentSchema]
}, { timestamps: true });
const Comment = (0, mongoose_1.model)('Comment', CommentSchema);
exports.default = Comment;
