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
exports.getPostsByCategory = exports.savePost = exports.createCategory = exports.Unsave = exports.googlelogin = exports.editPost = exports.deletePost = exports.removeLike = exports.addLike = exports.fetchPosts = exports.createPost = void 0;
const postRepository_1 = require("../repositories/postRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const Notifcation_1 = require("../repositories/Notifcation");
const userRepository = new UserRepository_1.UserRepository();
const notificationRepository = new Notifcation_1.NotificationRepository();
const postRepository = new postRepository_1.PostRepository();
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { caption, postUrl, type } = req.body;
        const userId = req.body.userId;
        const newPost = yield postRepository.savePost(caption, postUrl, userId, type);
        // If the post is successfully saved, send a success response
        if (newPost) {
            res.status(200).json({ success: true, postData: newPost });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.createPost = createPost;
const fetchPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postData = yield postRepository.findPosts();
        res.status(200).json({ success: true, postData });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.fetchPosts = fetchPosts;
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const userId = req.body.userId;
        const reciver = req.body.PostOwner;
        if (!postId || !userId) {
            res
                .status(400)
                .json({ success: false, error: "Post ID and user ID are required" });
            return;
        }
        // Call the repository method to add the like to the post
        const like = yield postRepository.addLike(postId, userId);
        yield notificationRepository.saveNotification(reciver, userId, "like");
        res
            .status(200)
            .json({ success: true, message: "Like added successfully", like });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.addLike = addLike;
const removeLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const userId = req.body.userId;
        if (!postId || !userId) {
            res
                .status(400)
                .json({ success: false, error: "Post ID and user ID are required" });
            return;
        }
        // Call the repository method to add the like to the post
        const like = yield postRepository.removeLike(postId, userId);
        res
            .status(200)
            .json({ success: true, message: "Like added successfully", like });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.removeLike = removeLike;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const deletedPost = yield postRepository.deletePost(postId);
        if (deletedPost) {
            res
                .status(200)
                .json({ success: true, message: "post  deleted successfully" });
        }
        else {
            res
                .status(404)
                .json({ success: false, message: "vpost Comment not found" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.deletePost = deletePost;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { caption } = req.body;
        // Call the repository function to edit the post
        const editedPost = yield postRepository.editPost(postId, caption);
        if (editedPost) {
            res.status(200).json({
                success: true,
                message: "Post edited successfully",
                editedPost,
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "Post not found or could not be edited",
            });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.editPost = editPost;
const googlelogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { caption } = req.body;
        // Call the repository function to edit the post
        const editedPost = yield postRepository.editPost(postId, caption);
        if (editedPost) {
            res.status(200).json({
                success: true,
                message: "Post edited successfully",
                editedPost,
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "Post not found or could not be edited",
            });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.googlelogin = googlelogin;
const Unsave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId } = req.body;
        const updatedUser = yield userRepository.UnsavePostToUser(userId, postId);
        res.status(200).json({
            success: true,
            message: "Post saved successfully",
            user: updatedUser,
        });
        // Call the repository function to edit the post
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.Unsave = Unsave;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        const { userId, categoryName } = req.body;
        const userData = yield userRepository.SaveCategory(userId, categoryName);
        res.status(200).json({
            success: true,
            message: "create category successfully",
            userData,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.createCategory = createCategory;
const savePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId, category } = req.body;
        const updatedUser = yield userRepository.savePostToUser(userId, postId, category);
        res.status(200).json({
            success: true,
            message: "Post saved successfully",
            user: updatedUser,
        });
        // Call the repository function to edit the post
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.savePost = savePost;
const getPostsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, categoryName } = req.params;
        const SavedPosts = yield userRepository.getSavedPost(userId, categoryName);
        res.status(200).json({ success: true, posts: SavedPosts });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.getPostsByCategory = getPostsByCategory;
