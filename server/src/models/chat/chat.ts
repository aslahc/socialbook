import mongoose, { Document, Schema, Model } from 'mongoose';

// Define interface for Chat document
 export interface IChat extends Document {
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define Chat schema with TypeScript types
const ChatSchema: Schema<IChat> = new Schema<IChat>(
  {
    members: {
      type: [String], // Array of strings (user IDs)
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Define Chat model with TypeScript types
const ChatModel: Model<IChat> = mongoose.model<IChat>('Chat', ChatSchema);

export default ChatModel;
