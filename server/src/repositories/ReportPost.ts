import { ReportInterface } from "../models/Report/ReportType";
import Report from '../models/Report/Report'
import Post from '../models/post/post';

export class ReportRepository {
    async saveReport(userId: string, reason: string, postId: string): Promise<ReportInterface> {
        try {
         
            const report  = new Report({ 
                userId: userId,
                postId: postId,
                reason: reason,
                createdAt: new Date()
            });
    

            // Save the new comment to the database
            const savedReport = await report.save();
             return savedReport

        ;
        } catch (error) {
            console.error("Error saving comment:", error);
            throw error;
        }
    }




    async fetchReport(): Promise<ReportInterface[]> {
        try {
         
           const reports = await Report.find().populate('postId')
           console.log(reports,"po")
           return reports
           

       
        } catch (error) {
            console.error("Error saving comment:", error);
            throw error;
        }
    }


    
    async blockPost(id: string, isBlock: boolean): Promise<any | null> {
    try {
        // Find the post by its ID
        const post = await Post.findById(id);

        if (!post) {
            throw new Error("Post not found");
        }
       console.log(isBlock)
    
        post.isReport = isBlock;

        // Save the updated post
        const updatedPost = await post.save();

        return updatedPost;
        console.log("updaated")
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
}

}   