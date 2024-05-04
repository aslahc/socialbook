import { Schema, model } from "mongoose";
import { Istory } from './storyType'; // Import the interface
import User from '../user/user'; // Import the User model

const storySchema = new Schema<Istory>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true
    },
    stories: [{
        storyImg: {
            type: String,
            required: true
        },
        views: [{
            type: Schema.Types.ObjectId,
            ref: 'User' // Reference the User model for views
        }],
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

const Story = model<Istory>("Story", storySchema);

export default Story;
