import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMessage extends Document {
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>(
  {
    chatId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
