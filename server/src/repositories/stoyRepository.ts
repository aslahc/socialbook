
import {Istory} from '../models/story/storyType'
import Story from '../models/story/story'
import { Types } from 'mongoose';
import mongoose from "mongoose";
import User, { IUser } from '../models/user/user';

export class StoryRepository {
    async SaveStory(storyImg: string, userId: string): Promise<Istory> {
        try {
            const expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 1); // Expire after 1 day (24 hours)
    
            // Check if the user already has existing stories in the database
            let existingUser = await Story.findOne({ userId });
    
            if (existingUser) {
                // User exists, update their stories array
                existingUser.stories.push({
                    storyImg,
                    views: [],
                    createOn: new Date(),
                    expireOn: expireDate
                });
                const savedStory = await existingUser.save();
                return savedStory;
            } else {
                // User does not exist, create a new user with the story
                const newStory = await Story.create({
                    userId,
                    stories: [{
                        storyImg,
                        views: [],
                        createOn: new Date(),
                        expireOn: expireDate
                    }]
                });
                return newStory;
            }
        } catch (error) {
            console.error("Error saving story:");
            throw error;
        }
    }

    async removeExpiredStories(): Promise<void> {
        try {
            const currentDate = new Date();
            await Story.deleteMany({ expireOn: { $lte: currentDate } });
        } catch (error) {
            console.error("Error:", (error as Error).message);
            throw error;
        }
    }




    
   async findStory(): Promise<Istory[]> {
    try {
        

        const storyData = await Story.find().populate('userId')
        
        return storyData;

    } catch (error) {
        console.error("Error:", (error as Error).message);
        throw error;
    }
}


     async  deleteStory(userId: string, storyId: string, currentStory: string): Promise<void> {
    try {
        // Find the Story document by userId
        const story = await Story.findOne({ userId: new Types.ObjectId(userId) });

        if (!story) {
            throw new Error('Story not found');
        }

        // Locate the story to delete by its image URL (currentStory)
        const storyIndex = story.stories.findIndex(story => story.storyImg === currentStory);

        if (storyIndex === -1) {
            throw new Error('Story with provided image URL not found');
        }

        // Remove the story from the stories array
        story.stories.splice(storyIndex, 1);
         console.log("story deleted succesfully " )
        // Save the updated Story document
        await story.save();

        console.log('Story deleted successfully');
    } catch (error) {
        console.error('Error:', (error as Error).message);
        throw error;
    }
}

async findStoryByImg(storyImg: string): Promise<Istory | null> {
    try {
      const story = await Story.findOne({ 'stories.storyImg': storyImg });
      if (story) {
        // If a story is found, you can access it here
        console.log('Found Story:', story);
        return story;
      } else {
        // Story not found
        console.log('Story not found for image:', storyImg);
        return null;
      }
    } catch (error) {
      console.error('Error finding story by image:', (error as Error).message);
      throw error;
    }
  }
  
  async addViewToStory(storyImg: string, userId: string): Promise<void> {
    try {
      await Story.updateOne(
        { 'stories.storyImg': storyImg, 'stories.views': { $ne: userId } },
        { $push: { 'stories.$.views': userId } }
      );
    } catch (error) {
      console.error('Error adding view to story:', (error as Error).message);
      throw error;
    }
  }

  async findByImageUrl(storyImg: string): Promise<any> {
    try {
        const story = await Story.findOne({ 'stories.storyImg': storyImg });
        return story;
    } catch (error) {
        console.error("Error:", (error as Error).message);
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
              console.log('Username:', user.username); // Log the username
              return { userId, user };
            } else {
              console.log('User not found for userId:', userId);
              return { userId };
            }
          } catch (error) {
            console.error("Error populating views:", (error as Error).message);
            throw error;
          }
        })
      );
      return populatedViews;
    } catch (error) {
      console.error("Error:", (error as Error).message);
      throw error;
    }
  }
}
