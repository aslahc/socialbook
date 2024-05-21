import Comment from "../models/comment/comment";
import { CommentInterface } from "../models/comment/commentType";

export class CommentRepository {
  async saveComment(
    userId: string,
    content: string,
    postId: string
  ): Promise<CommentInterface> {
    try {
      const newComment = new Comment({
        userId: userId,
        postId: postId,
        comment: content,
        createdAt: new Date(),
      });
      // Save the new comment to the database
      const savedComment = await newComment.save();
      await savedComment.populate("userId");
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
      const comments = await Comment.find({ postId })
        .populate("userId")
        .populate("replyComments.userId");

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
  async saveReplayComment(
    newReply: any,
    commentId: string
  ): Promise<CommentInterface> {
    try {
      console.log(newReply);

      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error("Comment not found");
      }

      // Add the new reply to the replyComments array
      comment.replyComments.push(newReply);

      // Save the updated comment document
      const updatedComment = await comment.save();
      const replySaved = await updatedComment.populate("replyComments.userId");
      return replySaved;
    } catch (error) {
      console.error("Error:", (error as Error).message);

      throw error;
    }
  }
}
