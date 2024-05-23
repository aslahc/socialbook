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
exports.AdminRepository = void 0;
const comment_1 = __importDefault(require("../models/comment/comment"));
const post_1 = __importDefault(require("../models/post/post"));
const Report_1 = __importDefault(require("../models/Report/Report"));
const user_1 = __importDefault(require("../models/user/user"));
const date_fns_1 = require("date-fns");
class AdminRepository {
    getTotalReport() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch the required data from the database
                const totalUsers = yield user_1.default.countDocuments();
                const totalPosts = yield post_1.default.countDocuments();
                const totalActiveUsers = yield user_1.default.countDocuments({ isBlock: false });
                const totalReels = yield post_1.default.find({ type: "reel" }).countDocuments();
                const totalComments = yield comment_1.default.countDocuments();
                const totalReportedPosts = yield Report_1.default.countDocuments();
                // Construct the report data object
                const reportData = {
                    totalUsers,
                    totalPosts,
                    totalActiveUsers,
                    totalReels,
                    totalComments,
                    totalReportedPosts,
                };
                return reportData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    Graphdata() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentDate = new Date();
                // Monthly data
                const monthlyUsers = yield user_1.default.aggregate([
                    {
                        $match: {
                            createdOn: {
                                $gte: (0, date_fns_1.startOfYear)(currentDate),
                                $lte: (0, date_fns_1.endOfYear)(currentDate),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { $month: "$createdOn" },
                            count: { $sum: 1 },
                        },
                    },
                ]);
                const monthlyPosts = yield post_1.default.aggregate([
                    {
                        $match: {
                            createdOn: {
                                $gte: (0, date_fns_1.startOfYear)(currentDate),
                                $lte: (0, date_fns_1.endOfYear)(currentDate),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { $month: "$createdOn" },
                            count: { $sum: 1 },
                        },
                    },
                ]);
                // Yearly data
                const yearlyUsers = yield user_1.default.aggregate([
                    {
                        $match: {
                            createdOn: {
                                $gte: (0, date_fns_1.startOfYear)(currentDate),
                                $lte: (0, date_fns_1.endOfYear)(currentDate),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { $year: "$createdOn" },
                            count: { $sum: 1 },
                        },
                    },
                ]);
                const yearlyPosts = yield post_1.default.aggregate([
                    {
                        $match: {
                            createdOn: {
                                $gte: (0, date_fns_1.startOfYear)(currentDate),
                                $lte: (0, date_fns_1.endOfYear)(currentDate),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { $year: "$createdOn" },
                            count: { $sum: 1 },
                        },
                    },
                ]);
                return {
                    monthlyUsers,
                    monthlyPosts,
                    yearlyUsers,
                    yearlyPosts,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
