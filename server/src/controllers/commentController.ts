import { Request, Response } from "express";
import { CommentRepository } from "../repositories/commentRepository";
import { CommentInterface } from "../models/comment/commentType";

const commentRepository = new CommentRepository();

export const postComment = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract comment data from request body

        const { newComment,postId } = req.body;
              const userId = newComment.userId
              const comment = newComment.comment        
        // Create comment data object
      
        // Save comment data to database
        
        const commentSaved = await commentRepository.saveComment(userId,comment,postId);

        if (commentSaved) {
            res.status(200).json({ success: true, message: "Comment saved successfully" ,commentSaved});
        } else {
            res.status(500).json({ success: false, error: "Failed to save comment" });
        }
    } catch (error) {
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


 export  const getComment = async(req:Request, res: Response) : Promise<void> =>{
     
    try{

        const {postId } = req.params

        const comments = await commentRepository.fetchComment(postId)
        res.status(200).json({ success: true, comments })

    }catch(error){
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: 'Failed to fetch comments' });

    }
    
 }

 

 export  const deleteComment = async(req:Request, res: Response) : Promise<void> =>{
     
    try{

        const { commentId } = req.params;

        const deletedComment = await commentRepository.deleteComment(commentId);

        if (deletedComment) {
            res.status(200).json({ success: true, message: 'Comment deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Comment not found' });
        }

    }catch(error){
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: 'Failed to fetch comments' });

    }
    
}