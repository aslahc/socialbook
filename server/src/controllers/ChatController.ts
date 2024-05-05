import { Request, Response } from 'express';
import ChatModel, { IChat } from '../models/chat/chat';

export const createChat = async (req: Request, res: Response): Promise<void> => {
  const { senderId, receiverId } = req.body;

  const newChat: IChat = new ChatModel({
    members: [senderId, receiverId],
  });

  try {
    const result: IChat = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

export const userChats = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const chats: IChat[] = await ChatModel.find({
      members: { $in: [userId] },
    });
    console.log(chats)
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user chats' });
  }
};

export const findChat = async (req: Request, res: Response): Promise<void> => {
  const { firstId, secondId } = req.params;

  try {
    const chat: IChat | null = await ChatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) {
      res.status(200).json(chat);
    } else {
      res.status(404).json({ message: 'Chat not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to find chat' });
  }
};
