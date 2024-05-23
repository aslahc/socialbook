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
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyViews = exports.watchStory = exports.deleteStory = exports.fetchStoryData = exports.createStory = void 0;
const stoyRepository_1 = require("../repositories/stoyRepository");
const storyRepository = new stoyRepository_1.StoryRepository();
const createStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storyImg, userId } = req.body;
        const savedStory = yield storyRepository.SaveStory(storyImg, userId);
        if (savedStory) {
            res.status(201).json({ success: true, data: savedStory });
        }
        else {
            res.status(500).json({ success: false, error: "Failed to save story" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.createStory = createStory;
const fetchStoryData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storyData = yield storyRepository.findStory();
        res.status(200).json({ success: true, storyData });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.fetchStoryData = fetchStoryData;
const deleteStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, currentStory } = req.body;
        const { storyId } = req.params;
        const storyData = yield storyRepository.deleteStory(userId, storyId, currentStory);
        res.status(200).json({ success: true, storyData });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.deleteStory = deleteStory;
const watchStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storyImg, userId } = req.body;
        if (!storyImg || !userId) {
            res
                .status(400)
                .json({ success: false, error: "Missing required parameters" });
            return;
        }
        // Find the story by storyImg
        const story = yield storyRepository.findStoryByImg(storyImg);
        if (!story) {
            res.status(404).json({ success: false, error: "Story not found" });
            return;
        }
        // Check if userId is already in views
        const userAlreadyViewed = story.stories.some((storyItem) => storyItem.views.includes(userId));
        if (!userAlreadyViewed) {
            // userId not in views, update the story with userId
            yield storyRepository.addViewToStory(storyImg, userId);
            res.status(200).json({ success: true, message: "User added to views" });
        }
        else {
            res
                .status(200)
                .json({ success: true, message: "User already viewed this story" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.watchStory = watchStory;
const storyViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const storyImg = req.query.storyImg; // Get the story image URL from the request query
        if (!storyImg) {
            res
                .status(400)
                .json({ success: false, error: "Missing storyImg parameter" });
            return;
        }
        // Find the story based on the provided image URL
        const story = yield storyRepository.findByImageUrl(storyImg);
        if (!story) {
            res.status(404).json({ success: false, error: "Story not found" });
            return;
        }
        // Extract views from the found story
        const views = (_a = story.stories.find((story) => story.storyImg === storyImg)) === null || _a === void 0 ? void 0 : _a.views;
        if (!views) {
            res
                .status(404)
                .json({ success: false, error: "Views not found for this story" });
            return;
        }
        // Populate user IDs in the views array
        const populatedViews = yield storyRepository.populateViews(views);
        // Send the populated views in the response
        res.status(200).json({ success: true, views: populatedViews });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.storyViews = storyViews;
