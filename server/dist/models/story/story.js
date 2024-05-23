"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const storySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true
    },
    stories: [{
            storyImg: {
                type: String,
                required: true
            },
            views: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
            createOn: {
                type: Date,
                default: Date.now
            },
            expireOn: {
                type: Date,
                required: true
            }
        }]
});
const Story = (0, mongoose_1.model)("Story", storySchema);
exports.default = Story;
