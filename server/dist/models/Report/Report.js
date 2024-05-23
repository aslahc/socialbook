"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_1 = __importDefault(require("../user/user"));
const post_1 = __importDefault(require("../post/post"));
const ReportSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_1.default,
        required: true
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: post_1.default,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
});
const Report = (0, mongoose_1.model)('Report', ReportSchema);
exports.default = Report;
