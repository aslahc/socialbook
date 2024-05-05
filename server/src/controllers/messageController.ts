import { Request, Response } from 'express';
import MessageModel, { IMessage } from '../models/chat/message';

export const addMessage = async (req: Request, res: Response): Promise<void> => {
  const { chatId, senderId, text } = req.body;

  const message: IMessage = new MessageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const result: IMessage = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add message' });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  const { chatId } = req.params;

  try {
    const messages: IMessage[] = await MessageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
