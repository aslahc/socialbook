import { ReportInterface } from "../models/Report/ReportType";
import Report from '../models/Report/Report'
import Post from '../models/post/post';

export class ReportRepository {
    async saveReport(userId: string, reason: string, postId: string): Promise<void> {
        try {
            // Create a new report instance
            const report = new Report({
                userId: userId,
                postId: postId,
                reason: reason,
                createdAt: new Date()
            });

            // Save the new report to the database

            // Fetch the post associated with the reported postId
            const post = await Post.findById(postId);

            if (!post) {
                throw new Error('Post not found');
            }

            // Increment reportCount
            post.reportCount += 1;

            // Check if reportCount reaches 3 and update isReport accordingly
            if (post.reportCount >= 3) {
                // post.isReport = true;
                await report.save();

            }

            // Save the updated post
            await post.save();

        } catch (error) {
            throw error;
        }
    }



    async fetchReport(): Promise<ReportInterface[]> {
        try {

            const reports = await Report.find().populate('postId')
            return reports



        } catch (error) {

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

            post.isReport = isBlock;

            // Save the updated post
            const updatedPost = await post.save();

            return updatedPost;
        } catch (error) {

            throw error;
        }
    }

}   