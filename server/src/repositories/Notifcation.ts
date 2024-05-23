import { Notification } from "../models/Notification/Notification"
import { INotification } from "../models/Notification/NotificationType";

import mongoose, { Types } from 'mongoose';
export class NotificationRepository {
  async saveNotification(userId: string, followerId: string, type: string): Promise<INotification | null> {
    try {
      // Create a new notification document based on the schema
      const newNotification = new Notification({
        sourceId: followerId, // Corrected typo: sorceId -> sourceId
        receiverId: new mongoose.Types.ObjectId(userId),
        type: type,
      });

      // Save the notification to the database
      const savedNotification = await newNotification.save();

      return savedNotification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error}`);
    }
  }

  async findNotifications(userId: string): Promise<INotification[]> {
    try {
      // Convert userId to ObjectId if receiverId is stored as ObjectId
      const objectId = mongoose.Types.ObjectId.createFromHexString(userId);

      // Use find to retrieve notifications where receiverId matches userId
      const notifications = await Notification.find({ receiverId: objectId }).populate('sourceId');


      return notifications;
    } catch (error) {
      throw new Error(`Failed to fetch notifications: ${error}`);
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      await Notification.findByIdAndDelete(notificationId);


      return true
    } catch (error) {
      throw new Error(`Failed to fetch notifications: ${error}`);
    }
  }
}