import { WriteError } from 'mongodb';
import User, { IUser } from '../models/user';
import bcrypt from 'bcrypt';

export class UserRepository {
    async emailExists(email: string): Promise<boolean> {
        try {
            const user = await User.findOne({ email });
            return !!user;
        } catch (error) {
            console.error("Error checking email existence:", error);
            throw error;
        }
    }

    async usernameExists(username: string): Promise<boolean> {
        try {
            const user = await User.findOne({ username });
            return !!user;
        } catch (error) {
            console.error("Error checking username existence:", error);
            throw error;
        }
    }

    async saveUser(userDetails: IUser): Promise<IUser> {
        try {
            const newUser = new User(userDetails);
            await newUser.save();
            return newUser.toObject();
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

    async findByUsername(username: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ username });
            return user;
        } catch (error) {
            console.error("Error finding user by username:", error);
            throw error;
        }
    }

    async findByUserDetails(username: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ username });
            return user;
        } catch (error) {
            console.error("Error finding user by details:", error);
            throw error;
        }
    }

    async comparePasswords(candidatePassword: string, hashedPassword: string): Promise<boolean> {
        try {
            const match = await bcrypt.compare(candidatePassword, hashedPassword);
            return match;
        } catch (error) {
            console.error("Error comparing passwords:", error);
            throw error;
        }
    }

    async findUsers(): Promise<IUser[]> {
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            console.error("Error finding users:", error);
            throw error;
        }
    }

    async updateUser(userId: string, data: any): Promise<IUser | null> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
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
            console.error('Error updating user:', error);
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
            console.error("Error blocking user:", error);
            throw error;
        }
    }

    async changepassword(newPassword: string, email: string): Promise<IUser | null> {
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
          console.error("Error changing user password:", error);
          throw error;
        }}
}
