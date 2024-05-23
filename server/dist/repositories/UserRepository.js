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
exports.UserRepository = void 0;
const user_1 = __importDefault(require("../models/user/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
class UserRepository {
    emailExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ email });
                return !!user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    usernameExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ username });
                return !!user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    SaveCategory(userId, categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the user by userId
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                // Check if the category already exists in the savePostCategory array
                if (user.savePostCategory.includes(categoryName)) {
                    console.error('Category already exists');
                    return user; // Return the user document as no change is made
                }
                // Add the category to the savePostCategory array
                user.savePostCategory.push(categoryName);
                // Save the updated user document
                const updatedUser = yield user.save();
                // Return the updated user document
                return updatedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    saveUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new user_1.default(userDetails);
                yield newUser.save();
                return newUser.toObject();
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ username });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findById(UserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findById(UserId);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findbyemail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ email });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByUserDetails(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ username });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    comparePasswords(candidatePassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const match = yield bcrypt_1.default.compare(candidatePassword, hashedPassword);
                return match;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_1.default.find();
                return users;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                user.fname = data.firstName;
                user.lname = data.lastName;
                user.profession = data.profession;
                user.bio = data.bio;
                user.profileimg = data.imageUrl;
                user.bannerImg = data.bannerUrl;
                const updatedUser = yield user.save();
                return updatedUser.toObject();
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockUser(userId, isBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                user.isBlock = isBlock;
                const updatedUser = yield user.save();
                return updatedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    changepassword(newPassword, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the user by their email
                const user = yield user_1.default.findOne({ email });
                if (!user) {
                    // If user not found, throw an error
                    throw new Error("User not found");
                }
                // Update the user's password
                user.password = newPassword;
                // Save the updated user
                const updatedUser = yield user.save();
                return updatedUser;
            }
            catch (error) {
                // Catch any errors that occur during the process
                throw error;
            }
        });
    }
    // async savePostToUser
    savePostToUser(userId, postId, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update user document to add category and postId
                const user = yield user_1.default.findByIdAndUpdate(userId, {
                    $addToSet: {
                        savePostCategory: category,
                        savedPost: { post: postId, category: category }
                    }
                }, { new: true } // Return the updated document
                );
                if (!user) {
                    throw new Error('User not found');
                }
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    UnsavePostToUser(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                // Find the saved post by postId
                const savedPostIndex = user.savedPost.findIndex((saved) => String(saved.post) === String(postId));
                if (savedPostIndex === -1) {
                    throw new Error('Post is not saved by this user');
                }
                // Remove the saved post from the array
                user.savedPost.splice(savedPostIndex, 1);
                // Save the updated user document
                const updatedUser = yield user.save();
                return updatedUser;
            }
            catch (error) {
                console.error("Error:", error.message);
                throw error;
            }
        });
    }
    getSavedPost(userId, categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findById(userId).populate('savedPost');
                if (user) {
                    const filteredPosts = user.savedPost.filter((post) => post.category === categoryName);
                    return filteredPosts;
                }
                else {
                }
            }
            catch (error) {
                console.error("Error:", error.message);
            }
        });
    }
    UserSuggestions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const suggestions = yield user_1.default.aggregate([
                    { $match: { _id: new mongoose_1.default.Types.ObjectId(userId) } },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'followers',
                            foreignField: '_id',
                            as: 'userFollowers'
                        }
                    },
                    { $unwind: '$userFollowers' },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userFollowers.followers',
                            foreignField: '_id',
                            as: 'suggestedUsers'
                        }
                    },
                    { $unwind: '$suggestedUsers' },
                    { $match: { 'suggestedUsers._id': { $ne: new mongoose_1.default.Types.ObjectId(userId) } } },
                    {
                        $group: {
                            _id: '$suggestedUsers._id',
                            username: { $first: '$suggestedUsers.username' },
                            email: { $first: '$suggestedUsers.email' },
                            profileimg: { $first: '$suggestedUsers.profileimg' }
                        }
                    },
                    { $limit: 6 }
                ]);
                return suggestions;
            }
            catch (error) {
                console.error("Error:", error.message);
            }
        });
    }
}
exports.UserRepository = UserRepository;
