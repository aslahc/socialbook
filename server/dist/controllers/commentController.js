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
Object.defineProperty(exports, "__esModule", { value: true });
exports.replayComment = exports.deleteComment = exports.getComment = exports.postComment = void 0;
const commentRepository_1 = require("../repositories/commentRepository");
const commentRepository = new commentRepository_1.CommentRepository();
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract comment data from request body
        const { newComment, postId } = req.body;
        const userId = newComment.userId;
        const comment = newComment.comment;
        // Create comment data object
        // Save comment data to database
        const commentSaved = yield commentRepository.saveComment(userId, comment, postId);
        if (commentSaved) {
            res.status(200).json({ success: true, message: "Comment saved successfully", commentSaved });
        }
        else {
            res.status(500).json({ success: false, error: "Failed to save comment" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.postComment = postComment;
const getComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const comments = yield commentRepository.fetchComment(postId);
        res.status(200).json({ success: true, comments });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch comments' });
    }
});
exports.getComment = getComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const deletedComment = yield commentRepository.deleteComment(commentId);
        if (deletedComment) {
            res.status(200).json({ success: true, message: 'Comment deleted successfully' });
        }
        else {
            res.status(404).json({ success: false, message: 'Comment not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch comments' });
    }
});
exports.deleteComment = deleteComment;
const replayComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newReply, commentId } = req.body;
        const replySaved = yield commentRepository.saveReplayComment(newReply, commentId);
        res.status(200).json({ success: true, message: "replay comment succuss ", replySaved });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch comments' });
    }
});
exports.replayComment = replayComment;
