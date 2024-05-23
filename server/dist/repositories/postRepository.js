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
exports.PostRepository = void 0;
const post_1 = __importDefault(require("../models/post/post"));
const user_1 = __importDefault(require("../models/user/user"));
const mongoose_1 = require("mongoose");
class PostRepository {
    savePost(caption, postUrl, userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the corresponding user document
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                // Create a new post instance
                const newPost = new post_1.default({
                    userId: user._id, // Assign the ObjectId of the user
                    caption: caption,
                    type: type,
                    postUrl: postUrl,
                    createdOn: Date.now()
                });
                // Save the new post to the database
                const savedPost = yield newPost.save();
                return savedPost; // Return the saved post with populated user data
            }
            catch (error) {
                throw error; // Rethrow the error to be handled by the caller
            }
        });
    }
    findPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield post_1.default.find({ isReport: false }).populate('userId').populate('comments');
                ;
                return posts;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addLike(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the post by postId
                const objectIdUserId = new mongoose_1.Types.ObjectId(userId);
                // Find the post by postId
                const post = yield post_1.default.findById(postId);
                if (!post) {
                    throw new Error('Post not found');
                }
                // Check if the user has already liked the post
                if (post.likes.includes(objectIdUserId)) {
                    throw new Error('User has already liked the post');
                }
                // Add the user's ID to the likes array
                post.likes.push(objectIdUserId);
                // Save the updated post document
                yield post.save();
                yield post.populate('userId');
                // Return the updated post object
                return post;
                // Return the updated post object
            }
            catch (error) {
                throw error; // Rethrow the error to be caught by the calling function
            }
        });
    }
    removeLike(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convert userId string to ObjectId
                const objectIdUserId = new mongoose_1.Types.ObjectId(userId);
                // Find the post by postId
                const post = yield post_1.default.findById(postId);
                // Check if the post exists
                if (!post) {
                    throw new Error('Post not found');
                }
                // Check if the user has already liked the post
                const indexOfUser = post.likes.indexOf(objectIdUserId);
                if (indexOfUser === -1) {
                    throw new Error('User has not liked the post');
                }
                // Remove the user's ID from the likes array
                post.likes.splice(indexOfUser, 1);
                // Save the updated post document
                yield post.save();
                yield post.populate('userId');
                // Return the updated post object
                return post;
            }
            catch (error) {
                throw error; // Rethrow the error to be caught by the calling function
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedPost = yield post_1.default.findByIdAndDelete(postId);
                if (deletedPost) {
                    return true; // Comment deleted successfully
                }
                else {
                    return false; // Comment not found or already deleted
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    editPost(postId, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedPost = yield post_1.default.findByIdAndUpdate(postId, { caption }, { new: true } // Return the updated document
                ).populate('userId');
                if (updatedPost) {
                    return updatedPost.toObject(); // Convert Mongoose document to plain object
                }
                return null; // Post not found
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.PostRepository = PostRepository;
