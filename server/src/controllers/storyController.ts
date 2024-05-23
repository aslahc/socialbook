import { Request, Response } from "express";
import { Istory } from "../models/story/storyType";
import { StoryRepository } from "../repositories/stoyRepository";
const storyRepository = new StoryRepository();

export const createStory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { storyImg, userId } = req.body;

    const savedStory = await storyRepository.SaveStory(storyImg, userId);
    if (savedStory) {
      res.status(201).json({ success: true, data: savedStory });
    } else {
      res.status(500).json({ success: false, error: "Failed to save story" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const fetchStoryData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storyData = await storyRepository.findStory();
    res.status(200).json({ success: true, storyData });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const deleteStory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, currentStory } = req.body;
    const { storyId } = req.params;
    const storyData = await storyRepository.deleteStory(
      userId,
      storyId,
      currentStory
    );
    res.status(200).json({ success: true, storyData });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const watchStory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { storyImg, userId } = req.body;
    if (!storyImg || !userId) {
      res
        .status(400)
        .json({ success: false, error: "Missing required parameters" });
      return;
    }

    // Find the story by storyImg
    const story = await storyRepository.findStoryByImg(storyImg);
    if (!story) {
      res.status(404).json({ success: false, error: "Story not found" });
      return;
    }

    // Check if userId is already in views

    const userAlreadyViewed = story.stories.some((storyItem) =>
      storyItem.views.includes(userId)
    );

    if (!userAlreadyViewed) {
      // userId not in views, update the story with userId
      await storyRepository.addViewToStory(storyImg, userId);
      res.status(200).json({ success: true, message: "User added to views" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "User already viewed this story" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const storyViews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storyImg = req.query.storyImg as string; // Get the story image URL from the request query

    if (!storyImg) {
      res
        .status(400)
        .json({ success: false, error: "Missing storyImg parameter" });
      return;
    }

    // Find the story based on the provided image URL
    const story = await storyRepository.findByImageUrl(storyImg);

    if (!story) {
      res.status(404).json({ success: false, error: "Story not found" });
      return;
    }

    // Extract views from the found story
    const views = story.stories.find(
      (story: any) => story.storyImg === storyImg
    )?.views;
    if (!views) {
      res
        .status(404)
        .json({ success: false, error: "Views not found for this story" });
      return;
    }

    // Populate user IDs in the views array
    const populatedViews = await storyRepository.populateViews(views);

    // Send the populated views in the response
    res.status(200).json({ success: true, views: populatedViews });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
