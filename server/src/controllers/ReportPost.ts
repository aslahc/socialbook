import { Request, Response } from "express";
import { ReportRepository } from "../repositories/ReportPost";

const reportRepository = new ReportRepository();
export const reportPost = async (req: Request, res: Response) => {
  try {
    const { userId, postId, reason } = req.body;

    // Call the saveReport method from ReportRepository to save the report
    await reportRepository.saveReport(userId, reason, postId);

    // Respond with success message
    res
      .status(200)
      .json({ success: true, message: "Post reported successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const fetchReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reportedPost = await reportRepository.fetchReport();

    res.status(200).json({
      success: true,
      message: "Post reported successfully",
      reportedPost,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const blockPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId, isBlocked } = req.body;
    const id = postId._id;
    const block = await reportRepository.blockPost(id, isBlocked);
    if (block) {
      res.status(200).json({ message: "User blocked successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
