import { Istory } from "../models/story/storyType";
import Story from "../models/story/story";
import { Types } from "mongoose";
import mongoose from "mongoose";
import User, { IUser } from "../models/user/user";

export class StoryRepository {
  async SaveStory(storyImg: string, userId: string): Promise<Istory> {
    try {
      const expireDate = new Date();
      expireDate.setMinutes(expireDate.getMinutes() + 5); // Expire after 1 day (24 hours)

      // Check if the user already has existing stories in the database
      let existingUser = await Story.findOne({ userId });

      if (existingUser) {
        // User exists, update their stories array
        existingUser.stories.push({
          storyImg,
          views: [],
          createOn: new Date(),
          expireOn: expireDate,
        });
        const story = await existingUser.save();
        const savedStory = await story.populate("userId");
        return savedStory;
      } else {
        // User does not exist, create a new user with the story
        const newStory = await Story.create({
          userId,
          stories: [
            {
              storyImg,
              views: [],
              createOn: new Date(),
              expireOn: expireDate,
            },
          ],
        });
        return newStory;
      }
    } catch (error) {
      throw error;
    }
  }

  async removeExpiredStories(): Promise<void> {
    try {
      const currentDate = new Date();
      await Story.deleteMany({ expireOn: { $lte: currentDate } });
    } catch (error) {
      throw error;
    }
  }

  startExpirationTask(intervalInMinutes: number = 1): void {
    // Run removeExpiredStories every specified interval (in minutes)
    setInterval(async () => {
      try {
        await this.removeExpiredStories();
      } catch (error) {
      }
    }, intervalInMinutes * 60 * 1000); // Convert minutes to milliseconds
  }

  async findStory(): Promise<Istory[]> {
    try {
      const storyData = await Story.find().populate("userId");

      return storyData;
    } catch (error) {
      throw error;
    }
  }

  async deleteStory(
    userId: string,
    storyId: string,
    currentStory: string
  ): Promise<boolean> {
    try {
      // Find the Story document by userId
      const story = await Story.findOne({ userId: new Types.ObjectId(userId) });

      if (!story) {
        throw new Error("Story not found");
      }

      // Locate the story to delete by its image URL (currentStory)
      const storyIndex = story.stories.findIndex(
        (story) => story.storyImg === currentStory
      );

      if (storyIndex === -1) {
        throw new Error("Story with provided image URL not found");
      }

      // Remove the story from the stories array
      story.stories.splice(storyIndex, 1);
      // Save the updated Story document
      await story.save();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async findStoryByImg(storyImg: string): Promise<Istory | null> {
    try {
      const story = await Story.findOne({ "stories.storyImg": storyImg });
      if (story) {
        // If a story is found, you can access it here
        return story;
      } else {
        // Story not found
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async addViewToStory(storyImg: string, userId: string): Promise<void> {
    try {
      await Story.updateOne(
        { "stories.storyImg": storyImg, "stories.views": { $ne: userId } },
        { $push: { "stories.$.views": userId } }
      );
    } catch (error) {
      throw error;
    }
  }

  async findByImageUrl(storyImg: string): Promise<any> {
    try {
      const story = await Story.findOne({ "stories.storyImg": storyImg });
      return story;
    } catch (error) {
      throw error;
    }
  }

  async populateViews(views: Types.ObjectId[]): Promise<any[]> {
    try {
      const populatedViews = await Promise.all(
        views.map(async (userId) => {
          try {
            const user = await User.findById(userId);
            if (user) {
              return { userId, user };
            } else {
              return { userId };
            }
          } catch (error) {
            throw error;
          }
        })
      );
      return populatedViews;
    } catch (error) {
      throw error;
    }
  }
}
