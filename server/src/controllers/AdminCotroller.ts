import { Request, Response } from "express";
import { AdminRepository } from "../repositories/AdminRepository";

const adminRepository = new AdminRepository();
export const totalReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reportData = await adminRepository.getTotalReport();
    res.status(200).json(reportData);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const Graphdata = async (req: Request, res: Response): Promise<void> => {
  try {
    const Graphdata = await adminRepository.Graphdata();
    res.status(200).json(Graphdata);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
