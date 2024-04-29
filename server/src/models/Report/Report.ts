import { Schema , model } from "mongoose";
import { ReportInterface } from "./ReportType";

import User from '../user/user'
import Post from "../post/post";

const ReportSchema = new Schema<ReportInterface>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:Post,
        required:true
    },
    reason:{
        type:String,
            required:true
        },
        
    createdOn: {
        type: Date,
        default: Date.now
    },
})
const Report = model<ReportInterface>('Report',ReportSchema)
export default  Report