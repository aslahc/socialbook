import Message from "../models/chat/message";
import { MessageDocument } from "../models/chat/messageType";
import Conversation from "../models/chat/conversation";
import { ConversationDocument } from "../models/chat/conversationType";
import { Types } from "mongoose";

export class MessageRepository {
  async create(
    conversationId: string,
    sender: string,
    text: string,
    reciver: string,
    timestamp: number,
    messageType: string
  ): Promise<MessageDocument> {
    try {
      const newMessage = new Message({
        conversationId: conversationId,
        sender: sender,
        reciver: reciver,
        text: text,
        messageType: messageType,
        timestamp: timestamp,
      });
      return await newMessage.save();
    } catch (error) {
      throw new Error(`Failed to create message: ${error}`);
    }
  }

  async findMessagesByUserId(
    userId: string,
    receiverId: string
  ): Promise<MessageDocument[]> {
    try {
      const conversation = await Conversation.findOne({
        members: {
          $all: [new Types.ObjectId(userId), new Types.ObjectId(receiverId)],
        },
      });

      if (!conversation) {
        // If no conversation found, return an empty array
        return [];
      }

      // Find messages for the conversation
      const messages = await Message.find({
        conversationId: conversation._id,
      }).sort({ createdAt: 1 });
      return messages;
    } catch (error) {
      throw new Error(`Failed to fetch messages for user ${userId}: ${error}`);
    }
  }
}
