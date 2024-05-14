import mongoose, { Schema, Document } from 'mongoose';
import {INotification} from './NotificationType'



// Define the Notification schema
const NotificationSchema: Schema = new Schema({
  sourceId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'comment', 'mention', 'follow'], required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});


export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
