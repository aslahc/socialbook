
import {Istory} from '../models/story/storyType'
import Story from '../models/story/story'
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


async deleteStory(userId:string,storyId:string): Promise<void> {
    try { 
        console.log(storyId)
        // const updatedStory = await StoryModel.findOneAndUpdate(
        //     { userId: userId }, // Find the document by userId
        //     { $pull: { stories: { _id: storyId } } }, // Pull (remove) the story with the given storyId from the stories array
        //     { new: true } // Return the updated document after the update operation
        //   );

    

    } catch (error) {
        console.error("Error:", (error as Error).message);
        throw error;
    }
}
}``