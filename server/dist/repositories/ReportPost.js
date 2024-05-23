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
exports.ReportRepository = void 0;
const Report_1 = __importDefault(require("../models/Report/Report"));
const post_1 = __importDefault(require("../models/post/post"));
class ReportRepository {
    saveReport(userId, reason, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create a new report instance
                const report = new Report_1.default({
                    userId: userId,
                    postId: postId,
                    reason: reason,
                    createdAt: new Date()
                });
                // Save the new report to the database
                // Fetch the post associated with the reported postId
                const post = yield post_1.default.findById(postId);
                if (!post) {
                    throw new Error('Post not found');
                }
                // Increment reportCount
                post.reportCount += 1;
                // Check if reportCount reaches 3 and update isReport accordingly
                if (post.reportCount >= 3) {
                    // post.isReport = true;
                    yield report.save();
                }
                // Save the updated post
                yield post.save();
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchReport() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield Report_1.default.find().populate('postId');
                return reports;
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockPost(id, isBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the post by its ID
                const post = yield post_1.default.findById(id);
                if (!post) {
                    throw new Error("Post not found");
                }
                post.isReport = isBlock;
                // Save the updated post
                const updatedPost = yield post.save();
                return updatedPost;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.ReportRepository = ReportRepository;
