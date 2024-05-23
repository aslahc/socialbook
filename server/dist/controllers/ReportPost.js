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
exports.blockPost = exports.fetchReport = exports.reportPost = void 0;
const ReportPost_1 = require("../repositories/ReportPost");
const reportRepository = new ReportPost_1.ReportRepository();
const reportPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, postId, reason } = req.body;
        // Call the saveReport method from ReportRepository to save the report
        yield reportRepository.saveReport(userId, reason, postId);
        // Respond with success message
        res
            .status(200)
            .json({ success: true, message: "Post reported successfully" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    }
});
exports.reportPost = reportPost;
const fetchReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportedPost = yield reportRepository.fetchReport();
        res.status(200).json({
            success: true,
            message: "Post reported successfully",
            reportedPost,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.fetchReport = fetchReport;
const blockPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, isBlocked } = req.body;
        const id = postId._id;
        const block = yield reportRepository.blockPost(id, isBlocked);
        if (block) {
            res.status(200).json({ message: "User blocked successfully" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.blockPost = blockPost;
