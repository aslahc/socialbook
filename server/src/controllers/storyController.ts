import { Request, Response } from "express";
import { Istory } from "../models/story/storyType";
import { StoryRepository } from "../repositories/stoyRepository";
const storyRepository = new StoryRepository()

export const createStory = async (req: Request, res: Response): Promise<void> => {
  try {
      const { storyImg, userId } = req.body;

      const savedStory = await storyRepository.SaveStory(storyImg, userId);

      if (savedStory) {
          res.status(201).json({ success: true, data: savedStory });
      } else {
          res.status(500).json({ success: false, error: 'Failed to save story' });
      }
  } catch (error) {
      console.error('Error:', (error as Error).message);
      res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const fetchStoryData = async (req: Request, res: Response): Promise<void> => {
  try {

    const storyData = await storyRepository.findStory()
    res.status(200).json({ success: true, storyData });

 
  } catch (error) {
      console.error("Error:", (error as Error).message); 

      res.status(500).json({ success: false, error: "Internal server error" });
  }
};