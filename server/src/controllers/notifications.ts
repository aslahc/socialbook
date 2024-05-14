import { Request, Response, NextFunction } from 'express';
import {NotificationRepository} from '../repositories/Notifcation';
const notificationRepository = new NotificationRepository()

export const notifications = async (req: Request, res: Response): Promise<void> => {


  
    try {
        console.log("enter to the get notification")
        const userId = req.params.userId; 
    const notifications = await notificationRepository.findNotifications(userId)
    console.log("got notfication",notifications)
    res.status(200).json({ succuss:true,notifications });

      // Additional logic or response handling here
    } catch (error) {
      console.error("Error:", (error as Error).message); 
      res.status(500).json({ error: "Something went wrong" });
  
      // Handle the error or send an appropriate response
    }
  }
  
  