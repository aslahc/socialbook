import { Request , Response ,  } from "express";
import { PostRepository } from "../repositories/postRepository";
import { UserRepository } from '../repositories/UserRepository';
const userRepository = new UserRepository();



const postRepository = new PostRepository()
export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { caption, postUrl } = req.body;
        const userId = req.body.userId;
        console.log(postUrl)// array of cloudinary url 
        
        // Call the savePost method of the postRepository to save the new post
        const newPost = await postRepository.savePost(caption, postUrl, userId);
        
        // If the post is successfully saved, send a success response
        if (newPost) {
        console.log("postsaved")
            res.status(200).json({ success: true,postData: newPost });
        }
    } catch (error) {
        // Catch any errors that occur during the process
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: "Internal server error" });
    }
}



  export const                                                                                                                                                                                                                                    fetchPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const postData = await postRepository.findPosts();
        res.status(200).json({ success: true, postData });
    } catch (error) {
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


export const addLike = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.id;
        const userId = req.body.userId 
        if (!postId || !userId) {
            res.status(400).json({ success: false, error: 'Post ID and user ID are required' });
            return;
        }

        // Call the repository method to add the like to the post
        const like = await postRepository.addLike(postId, userId);
        res.status(200).json({ success: true, message: 'Like added successfully', like });

    } catch (error) {
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


export const removeLike = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.id;
        const userId = req.body.userId 
        if (!postId || !userId) {
            res.status(400).json({ success: false, error: 'Post ID and user ID are required' });
            return;
        }

        // Call the repository method to add the like to the post
        const like = await postRepository.removeLike(postId, userId);
        res.status(200).json({ success: true, message: 'Like added successfully', like });

    } catch (error) {
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
       const {postId} = req.params 
       const deletedPost = await postRepository.deletePost(postId)
       if(deletedPost){
        res.status(200).json({ success: true, message: 'post  deleted successfully' });

       }else{
        res.status(404).json({ success: false, message: 'vpost Comment not found' });
           
       }
      

    } catch (error) {
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


export const editPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const { caption } = req.body;

        // Call the repository function to edit the post
        const editedPost = await postRepository.editPost(postId, caption);
         
        if (editedPost) {
            res.status(200).json({ success: true, message: 'Post edited successfully' ,editedPost});
        } else {
            res.status(404).json({ success: false, message: 'Post not found or could not be edited' });
        }
    } catch (error) {
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const googlelogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const { caption } = req.body;

        // Call the repository function to edit the post
        const editedPost = await postRepository.editPost(postId, caption);
         
        if (editedPost) {
            res.status(200).json({ success: true, message: 'Post edited successfully' ,editedPost});
        } else {
            res.status(404).json({ success: false, message: 'Post not found or could not be edited' });
        }
    } catch (error) {
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};



export const savePost = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("enterin got the req body",req.body)
    const {postId , userId} = req.body
    const updatedUser = await userRepository.savePostToUser(userId, postId);
   console.log(updatedUser)
        
    res.status(200).json({ success: true, message: 'Post saved successfully', user: updatedUser });

        // Call the repository function to edit the post
       
    } catch (error) {

        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};



export const Unsave = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("etrr",req.body)
    const {postId , userId} = req.body
    const updatedUser = await userRepository.UnsavePostToUser(userId, postId);
   console.log(updatedUser)
   console.log("upddate unsave")
    res.status(200).json({ success: true, message: 'Post saved successfully', user: updatedUser });

        // Call the repository function to edit the post
       
    } catch (error) {

        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

