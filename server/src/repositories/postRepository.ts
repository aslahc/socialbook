import { PostInterface } from '../models/post/postType';
import Post from '../models/post/post';
import User, { IUser } from '../models/user/user';

import { Types } from 'mongoose'

export class PostRepository {

    async savePost(caption: string, postUrl: string, userId: string, type: string): Promise<PostInterface> {
        try {
            // Find the corresponding user document
            const user = await User.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Create a new post instance
            const newPost = new Post({
                userId: user._id, // Assign the ObjectId of the user
                caption: caption,
                type: type,
                postUrl: postUrl,
                createdOn: Date.now()
            });
            // Save the new post to the database
            const savedPost = await newPost.save();


            return savedPost; // Return the saved post with populated user data
        } catch (error) {

            throw error; // Rethrow the error to be handled by the caller
        }
    }


    async findPosts(): Promise<PostInterface[]> {
        try {
            const posts = await Post.find({ isReport: false }).populate('userId').populate('comments');;
            return posts;
        } catch (error) {
            throw error;
        }
    }


    async addLike(postId: string, userId: string): Promise<PostInterface> {
        try {
            // Find the post by postId
            const objectIdUserId = new Types.ObjectId(userId);

            // Find the post by postId
            const post = await Post.findById(postId);
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
            await post.save();
            await post.populate('userId')
            // Return the updated post object
            return post;

            // Return the updated post object
        } catch (error) {
            throw error; // Rethrow the error to be caught by the calling function
        }
    }
    async removeLike(postId: string, userId: string): Promise<PostInterface> {
        try {
            // Convert userId string to ObjectId
            const objectIdUserId = new Types.ObjectId(userId);

            // Find the post by postId
            const post = await Post.findById(postId);

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
            await post.save();
            await post.populate('userId')

            // Return the updated post object
            return post;
        } catch (error) {

            throw error; // Rethrow the error to be caught by the calling function
        }
    }

    async deletePost(postId: string): Promise<boolean> {
        try {
            const deletedPost = await Post.findByIdAndDelete(postId);

            if (deletedPost) {
                return true; // Comment deleted successfully
            } else {
                return false; // Comment not found or already deleted
            }
        } catch (error) {

            throw error;
        }
    }
    async editPost(postId: string, caption: string): Promise<PostInterface | null> {
        try {
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                { caption },
                { new: true } // Return the updated document
            ).populate('userId')

            if (updatedPost) {
                return updatedPost.toObject(); // Convert Mongoose document to plain object
            }

            return null; // Post not found
        } catch (error) {

            throw error;
        }
    }
}


