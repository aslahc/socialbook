import { Request, Response } from "express";
import Conversation from "../models/chat/conversation";
import { ConversationDocument } from "../models/chat/conversationType";
import { MessageDocument } from "../models/chat/messageType";
import Message from "../models/chat/message";
import { conversationRepo } from "../repositories/conversationRepo";
import { MessageRepository } from "../repositories/MessageRepository";

const ConversationRepository = new conversationRepo();
const messageRepository = new MessageRepository();

export const saveMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { _id, messageText, reciver, timestamp, messageType } = req.body;

    let conversation = await ConversationRepository.findOneByMember(_id);

    if (!conversation) {
      conversation = await ConversationRepository.create([_id]);
    }

    await messageRepository.create(
      conversation._id ? conversation._id.toString() : null,
      _id,
      messageText,
      reciver,
      timestamp,
      messageType
    );
    const conversationId = conversation._id
      ? conversation._id.toString()
      : null;
    res.status(200).json({
      success: true,
      message: "Message saved successfully",
      conversationId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to save message" });
  }
};
export const messages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, receiverId } = req.params;

    // Find conversation IDs where the current user is a member
    const userConversations = await Conversation.find({ members: userId });

    // Find conversation IDs where the receiver is a member
    const receiverConversations = await Conversation.find({
      members: receiverId,
    });

    // Extract conversation IDs from results
    const userConvIds = userConversations.map((conv) => conv._id);
    const receiverConvIds = receiverConversations.map((conv) => conv._id);

    // Find messages sent by the current user in their conversations
    const sentMessages: MessageDocument[] = await Message.find({
      conversationId: { $in: userConvIds }, // Filter by conversations where the user is a member
      sender: userId, // Filter by sender (current user)
      reciver: receiverId, // Filter by receiver
    });

    // Find messages received by the current user in conversations with the receiver
    const receivedMessages: MessageDocument[] = await Message.find({
      conversationId: { $in: receiverConvIds }, // Filter by conversation IDs where the receiver is a member
      sender: receiverId,
      reciver: userId,
      // Filter by sender (receiver)
    });
    res.status(200).json({ success: true, sentMessages, receivedMessages });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};
