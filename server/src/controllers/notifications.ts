import { Request, Response, NextFunction } from "express";
import { NotificationRepository } from "../repositories/Notifcation";
const notificationRepository = new NotificationRepository();

export const notifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const notifications = await notificationRepository.findNotifications(
      userId
    );
    res.status(200).json({ succuss: true, notifications });

    // Additional logic or response handling here
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });

    // Handle the error or send an appropriate response
  }
};

export const dismmisNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const notification = req.params.id;

    const notificationData = await notificationRepository.deleteNotification(
      notification
    );
    if (notificationData) {
      res.status(200).json({ succuss: true, message: "notification delete " });
    }
    // Additional logic or response handling here
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });

    // Handle the error or send an appropriate response
  }
};
