"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const comment_1 = __importDefault(require("../models/comment/comment"));
class CommentRepository {
    saveComment(userId, content, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newComment = new comment_1.default({
                    userId: userId,
                    postId: postId,
                    comment: content,
                    createdAt: new Date(),
                });
                // Save the new comment to the database
                const savedComment = yield newComment.save();
                yield savedComment.populate("userId");
                // Return the saved comment data
                return savedComment;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchComment(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch comments for a specific postId and populate the 'userId' field
                const comments = yield comment_1.default.find({ postId })
                    .populate("userId")
                    .populate("replyComments.userId");
                // Return the array of comments
                return comments;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedComment = yield comment_1.default.findByIdAndDelete(commentId);
                if (deletedComment) {
                    return true; // Comment deleted successfully
                }
                else {
                    return false; // Comment not found or already deleted
                }
            }
            catch (error) {
                console.error("Error:", error.message);
                throw error;
            }
        });
    }
    saveReplayComment(newReply, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(newReply);
                const comment = yield comment_1.default.findById(commentId);
                if (!comment) {
                    throw new Error("Comment not found");
                }
                // Add the new reply to the replyComments array
                comment.replyComments.push(newReply);
                // Save the updated comment document
                const updatedComment = yield comment.save();
                const replySaved = yield updatedComment.populate("replyComments.userId");
                return replySaved;
            }
            catch (error) {
                console.error("Error:", error.message);
                throw error;
            }
        });
    }
}
exports.CommentRepository = CommentRepository;
