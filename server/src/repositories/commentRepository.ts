import Comment from '../models/comment/comment';
import { CommentInterface } from "../models/comment/commentType";

export class CommentRepository {
    async saveComment(userId: string, content: string, postId: string): Promise<CommentInterface> {
        try {
            console.log("going to save comment ");
            // Create a new instance of the Comment model with the provided comment data
            const newComment = new Comment({ 
                userId: userId,
                postId: postId,
                comment: content,
                createdAt: new Date()
            });
            console.log(newComment);

            // Save the new comment to the database
            const savedComment = await newComment.save();

            // Return the saved comment data
            return savedComment;
        } catch (error) {
            console.error("Error saving comment:", error);
            throw error;
        }
    }



    async fetchComment(postId: string): Promise<CommentInterface[]> {
        try {
            // Fetch comments for a specific postId and populate the 'userId' field
            const comments = await Comment.find({ postId }).populate('userId');

            // Return the array of comments
            return comments;
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw error;
        }
    }

    async deleteComment(commentId: string): Promise<boolean> {
        try {
            const deletedComment = await Comment.findByIdAndDelete(commentId);

            if (deletedComment) {
                return true; // Comment deleted successfully
            } else {
                return false; // Comment not found or already deleted
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }
}
    