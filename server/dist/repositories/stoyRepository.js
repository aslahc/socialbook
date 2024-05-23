"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryRepository = void 0;
const story_1 = __importDefault(require("../models/story/story"));
const mongoose_1 = require("mongoose");
const user_1 = __importDefault(require("../models/user/user"));
class StoryRepository {
    SaveStory(storyImg, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expireDate = new Date();
                expireDate.setMinutes(expireDate.getMinutes() + 5); // Expire after 1 day (24 hours)
                // Check if the user already has existing stories in the database
                let existingUser = yield story_1.default.findOne({ userId });
                if (existingUser) {
                    // User exists, update their stories array
                    existingUser.stories.push({
                        storyImg,
                        views: [],
                        createOn: new Date(),
                        expireOn: expireDate,
                    });
                    const story = yield existingUser.save();
                    const savedStory = yield story.populate("userId");
                    return savedStory;
                }
                else {
                    // User does not exist, create a new user with the story
                    const newStory = yield story_1.default.create({
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    removeExpiredStories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentDate = new Date();
                yield story_1.default.deleteMany({ expireOn: { $lte: currentDate } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    startExpirationTask(intervalInMinutes = 1) {
        // Run removeExpiredStories every specified interval (in minutes)
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.removeExpiredStories();
            }
            catch (error) {
            }
        }), intervalInMinutes * 60 * 1000); // Convert minutes to milliseconds
    }
    findStory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storyData = yield story_1.default.find().populate("userId");
                return storyData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteStory(userId, storyId, currentStory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the Story document by userId
                const story = yield story_1.default.findOne({ userId: new mongoose_1.Types.ObjectId(userId) });
                if (!story) {
                    throw new Error("Story not found");
                }
                // Locate the story to delete by its image URL (currentStory)
                const storyIndex = story.stories.findIndex((story) => story.storyImg === currentStory);
                if (storyIndex === -1) {
                    throw new Error("Story with provided image URL not found");
                }
                // Remove the story from the stories array
                story.stories.splice(storyIndex, 1);
                // Save the updated Story document
                yield story.save();
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findStoryByImg(storyImg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const story = yield story_1.default.findOne({ "stories.storyImg": storyImg });
                if (story) {
                    // If a story is found, you can access it here
                    return story;
                }
                else {
                    // Story not found
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    addViewToStory(storyImg, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield story_1.default.updateOne({ "stories.storyImg": storyImg, "stories.views": { $ne: userId } }, { $push: { "stories.$.views": userId } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByImageUrl(storyImg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const story = yield story_1.default.findOne({ "stories.storyImg": storyImg });
                return story;
            }
            catch (error) {
                throw error;
            }
        });
    }
    populateViews(views) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const populatedViews = yield Promise.all(views.map((userId) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const user = yield user_1.default.findById(userId);
                        if (user) {
                            return { userId, user };
                        }
                        else {
                            return { userId };
                        }
                    }
                    catch (error) {
                        throw error;
                    }
                })));
                return populatedViews;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.StoryRepository = StoryRepository;
