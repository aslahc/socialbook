import Comment from "../models/comment/comment";
import Post from '../models/post/post';
import Report from '../models/Report/Report'

import User from '../models/user/user';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
export class AdminRepository {
    async getTotalReport() {
        try {
            // Fetch the required data from the database
            const totalUsers = await User.countDocuments();
            const totalPosts = await Post.countDocuments();
            const totalActiveUsers = await User.countDocuments({ isBlock: false });
            const totalReels = await Post.find({ type: "reel" }).countDocuments();

            const totalComments = await Comment.countDocuments();
            const totalReportedPosts = await Report.countDocuments();

            // Construct the report data object
            const reportData = {
                totalUsers,
                totalPosts,
                totalActiveUsers,
                totalReels,
                totalComments,
                totalReportedPosts
            };

            return reportData;
        } catch (error) {
            console.error("Error:", (error as Error).message);
            throw error;
        }
    }
    async Graphdata() {
        try {
            const currentDate = new Date();

            // Monthly data
            const monthlyUsers = await User.aggregate([
                {
                    $match: {
                        createdOn: {
                            $gte: startOfYear(currentDate),
                            $lte: endOfYear(currentDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdOn" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            const monthlyPosts = await Post.aggregate([
                {
                    $match: {
                        createdOn: {
                            $gte: startOfYear(currentDate),
                            $lte: endOfYear(currentDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdOn" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Yearly data
            const yearlyUsers = await User.aggregate([
                {
                    $match: {
                        createdOn: {
                            $gte: startOfYear(currentDate),
                            $lte: endOfYear(currentDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $year: "$createdOn" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            const yearlyPosts = await Post.aggregate([
                {
                    $match: {
                        createdOn: {
                            $gte: startOfYear(currentDate),
                            $lte: endOfYear(currentDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $year: "$createdOn" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            return {
                monthlyUsers,
                monthlyPosts,
                yearlyUsers,
                yearlyPosts
            };
        } catch (error) {
            console.error("Error:", (error as Error).message);
            throw error;
        }
    }
}
