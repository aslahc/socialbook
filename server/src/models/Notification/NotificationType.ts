
import mongoose, { Schema, Document } from 'mongoose';


export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    reciverId: mongoose.Types.ObjectId;
    type: 'like' | 'comment' | 'mention'; // Define notification types
    sourceId: mongoose.Types.ObjectId;
    createdAt: Date;
    read: boolean;
  }