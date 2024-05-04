import { Request , Response ,  } from "express";
import {ReportRepository} from '../repositories/ReportPost'

const  reportRepository = new ReportRepository()
export const reportPost = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Entering reportPost function");
        const { userId, postId, reason } = req.body;

        // Call the saveReport method from ReportRepository to save the report
        await reportRepository.saveReport(userId, reason, postId);

        // Respond with success message
        res.status(200).json({ success: true, message: "Post reported successfully" });
    } catch (error) {
        // Handle errors
        console.error("Error:", (error as Error).message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


export const fetchReport = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("enternann")
        const reportedPost  = await reportRepository.fetchReport()

        res.status(200).json({ success: true, message: "Post reported successfully",reportedPost });
    } catch (error) {
        // Catch any errors that occur during the process
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: "Internal server error" });
    }
    

    
};
        
export const blockPost = async (req: Request, res: Response): Promise<void> => {
    try {       
        console.log("lla lal la la")
        // console.log(req.body)
        const {postId, isBlocked} = req.body
        const id = postId._id
        console.log(isBlocked,"sdsd   ")
       const block = await reportRepository.blockPost(id,isBlocked)
       if(block){
    console.log("dddddfdfdf")
       res.status(200).json({ message: "User blocked successfully" });
    }
    } catch (error) {
        // Catch any errors that occur during the process
        console.error("Error:", (error as Error).message); 

        res.status(500).json({ success: false, error: "Internal server error" });
    }

}