import { WriteError } from "mongodb";
import User, { IUser } from "../models/user/user";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export class UserRepository {
  async emailExists(email: string): Promise<boolean> {
    try {
      const user = await User.findOne({ email });
      return !!user;
    } catch (error) {
      throw error;
    }
  }

  async usernameExists(username: string): Promise<boolean> {
    try {
      const user = await User.findOne({ username });
      return !!user;
    } catch (error) {
      throw error;
    }
  }
  async SaveCategory(
    userId: string,
    categoryName: string
  ): Promise<IUser | null> {
    try {
      // Find the user by userId
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Check if the category already exists in the savePostCategory array
      if (user.savePostCategory.includes(categoryName)) {
        console.error("Category already exists");
        return user; // Return the user document as no change is made
      }

      // Add the category to the savePostCategory array
      user.savePostCategory.push(categoryName);

      // Save the updated user document
      const updatedUser = await user.save();

      // Return the updated user document

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async saveUser(userDetails: IUser): Promise<IUser> {
    try {
      const newUser = new User(userDetails);
      await newUser.save();
      return newUser.toObject();
    } catch (error) {
      throw error;
    }
  }

  async findByUsername(username: string): Promise<IUser | null> {
    try {
      console.log("enteer ttt");
      console.log("enter to repp");
      const user = await User.findOne({ username });
      console.log("didngt ege");
      console.log(user, "uy");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findById(UserId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(UserId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findbyemail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByUserDetails(username: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      const match = await bcrypt.compare(candidatePassword, hashedPassword);
      return match;
    } catch (error) {
      throw error;
    }
  }

  async findUsers(): Promise<IUser[]> {
    try {
      console.log("entering");
      const users = await User.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId: string, data: any): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      user.fname = data.firstName;
      user.lname = data.lastName;

      user.profession = data.profession;
      user.bio = data.bio;
      user.profileimg = data.imageUrl;
      user.bannerImg = data.bannerUrl;

      const updatedUser = await user.save();
      return updatedUser.toObject();
    } catch (error) {
      throw error;
    }
  }

  async blockUser(userId: string, isBlock: boolean): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      user.isBlock = isBlock;
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async changepassword(
    newPassword: string,
    email: string
  ): Promise<IUser | null> {
    try {
      // Find the user by their email
      const user = await User.findOne({ email });

      if (!user) {
        // If user not found, throw an error
        throw new Error("User not found");
      }

      // Update the user's password
      user.password = newPassword;

      // Save the updated user
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      // Catch any errors that occur during the process

      throw error;
    }
  }

  // async savePostToUser
  async savePostToUser(
    userId: string,
    postId: string,
    category: string
  ): Promise<IUser | null> {
    try {
      // Update user document to add category and postId
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            savePostCategory: category,
            savedPost: { post: postId, category: category },
          },
        },
        { new: true } // Return the updated document
      );

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
  async UnsavePostToUser(
    userId: string,
    postId: string
  ): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Find the saved post by postId
      const savedPostIndex = user.savedPost.findIndex(
        (saved) => String(saved.post) === String(postId)
      );
      if (savedPostIndex === -1) {
        throw new Error("Post is not saved by this user");
      }

      // Remove the saved post from the array
      user.savedPost.splice(savedPostIndex, 1);

      // Save the updated user document
      const updatedUser = await user.save();

      return updatedUser;
    } catch (error) {
      console.error("Error:", (error as Error).message);

      throw error;
    }
  }
  async getSavedPost(userId: string, categoryName: string): Promise<any> {
    try {
      const user = await User.findById(userId).populate("savedPost");
      if (user) {
        const filteredPosts = user.savedPost.filter(
          (post: any) => post.category === categoryName
        );
        return filteredPosts;
      } else {
      }
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }

  async UserSuggestions(userId: string): Promise<any> {
    try {
      const suggestions = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "userFollowers",
          },
        },
        { $unwind: "$userFollowers" },
        {
          $lookup: {
            from: "users",
            localField: "userFollowers.followers",
            foreignField: "_id",
            as: "suggestedUsers",
          },
        },
        { $unwind: "$suggestedUsers" },
        {
          $match: {
            "suggestedUsers._id": { $ne: new mongoose.Types.ObjectId(userId) },
          },
        },
        {
          $group: {
            _id: "$suggestedUsers._id",
            username: { $first: "$suggestedUsers.username" },
            email: { $first: "$suggestedUsers.email" },
            profileimg: { $first: "$suggestedUsers.profileimg" },
          },
        },
        { $limit: 6 },
      ]);
      return suggestions;
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }
}
