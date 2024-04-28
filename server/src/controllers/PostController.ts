import { Request , Response ,  } from "express";
import { PostRepository } from "../repositories/postRepository";



const postRepository = new PostRepository()
export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("enter to new create post ");
        const { caption, postUrl } = req.body;
        console.log(req.body.userId);
        const userId = req.body.userId;
        console.log(req.body);
        
        // Call the savePost method of the postRepository to save the new post
        const newPost = await postRepository.savePost(caption, postUrl, userId);
        
        // If the post is successfully saved, send a success response
        if (newPost) {
            console.log(newPost);
            res.status(200).json({ success: true,postData: newPost });
        }
    } catch (error) {
        // Catch any errors that occur during the process
        console.error("Error creating post:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}



  export const fetchPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const postData = await postRepository.findPosts();
        console.log("post data", postData,);
        res.status(200).json({ success: true, postData });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


export const addLike = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("enterong to the controeller ")
        const postId = req.params.id;
        console.log(req.body)
        const userId = req.body.userId 
        console.log(postId ,userId)
        if (!postId || !userId) {
            res.status(400).json({ success: false, error: 'Post ID and user ID are required' });
            return;
        }

        // Call the repository method to add the like to the post
        const like = await postRepository.addLike(postId, userId);
        console.log(like)
        console.log("like added")
        res.status(200).json({ success: true, message: 'Like added successfully', like });

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


export const removeLike = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("enterong to the controeller ")
        const postId = req.params.id;
        console.log(req.body)
        const userId = req.body.userId 
        console.log(postId ,userId)
        if (!postId || !userId) {
            res.status(400).json({ success: false, error: 'Post ID and user ID are required' });
            return;
        }

        // Call the repository method to add the like to the post
        const like = await postRepository.removeLike(postId, userId);
        console.log(like)
        console.log("like added")
        res.status(200).json({ success: true, message: 'Like added successfully', like });

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("enter to this controler ")
       const {postId} = req.params 
       const deletedPost = await postRepository.deletePost(postId)
       if(deletedPost){
        res.status(200).json({ success: true, message: 'post  deleted successfully' });

       }else{
        res.status(404).json({ success: false, message: 'vpost Comment not found' });
           
       }
      

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};
