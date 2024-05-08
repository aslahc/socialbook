import { Document, Types } from "mongoose";

    export interface Istory extends Document {
        views: any;
    
        userId: Types.ObjectId;
        stories: {
            storyImg: string;
            views: Types.ObjectId[];
            createOn: Date;
            expireOn: Date;
        }[];
}
