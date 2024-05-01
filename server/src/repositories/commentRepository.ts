import Comment from '../models/comment/comment';
import { CommentInterface } from "../models/comment/commentType";

export class CommentRepository {
    async saveComment(userId: string, content: string, postId: string): Promise<CommentInterface> {
        try {
         
            const newComment = new Comment({ 
                userId: userId,
                postId: postId,
                comment: content,
                createdAt: new Date()
            });
            // Save the new comment to the database
            const savedComment = await newComment.save();
             await savedComment.populate('userId')
            // Return the saved comment data
            return savedComment;
        } catch (error) {
            console.error("Error:", (error as Error).message); 

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
            console.error("Error:", (error as Error).message); 

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
            console.error("Error:", (error as Error).message); 

            throw error;
        }
    }
}
    