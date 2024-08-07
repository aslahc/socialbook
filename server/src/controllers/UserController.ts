import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import { UserRepository } from "../repositories/UserRepository";
import { NotificationRepository } from "../repositories/Notifcation";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
import { generateToken } from "../utils/jwtTocken";
import { generateRefreshToken } from "../utils/jwtTocken";
declare module "express-session" {
  interface Session {
    userDetails?: {
      username: string;
      email: string;
      password: string;
      phone: string;
    };
  }
}
dotenv.config();

import User, { IUser } from "../models/user/user";
import user from "../models/user/user";
import mongoose from "mongoose";

const userRepository = new UserRepository();
const notificationRepository = new NotificationRepository();

// user signup controller

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, phone } = req.body;

  try {
    const existUsername = await userRepository.usernameExists(username);

    if (existUsername) {
      res.status(400).json({ error: "Username already exists" });
    }

    const emailExists = await userRepository.emailExists(email);

    if (emailExists) {
      res.status(400).json({ error: "email is exist" });
    }
    let session = req.session;

    // You should set userDetails object with proper keys and values
    session.userDetails = {
      username: username,
      email: email,
      password: password,
      phone: phone,
    };
    const userData = req.session.userDetails;
    res.status(200).json({ success: true, userData });
    await emailVerification(email);

    // Additional logic or response handling here
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });

    // Handle the error or send an appropriate response
  }
};

// nodemailer code for otp
let otpVal: string;
export const emailVerification = async (email: string): Promise<void> => {
  try {
    otpVal = Math.floor(Math.random() * 10000).toString();
    console.log(otpVal);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL || "aslahcq@gmail.com",
        pass: process.env.PASS || "ngecfzxtztnkfiqi",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification Code",
      text: otpVal,
    };
    let info = await transporter.sendMail(mailOptions);
  } catch {}
};

// verify the otp

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp, userData } = req.body;

    if (otp !== otpVal) {
      res.status(400).json({ success: false, message: "Incorrect OTP" });
      return;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
    });

    const savedUser = await userRepository.saveUser(newUser);
    const user = await userRepository.findByUserDetails(userData.username);

    if (user) {
      const token = generateToken(user.id, "user");

      res.status(200).json({
        success: true,
        message: "User registered successfully",
        userData: user,
        token,
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "User not found after registration" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// verify the login

export const verifyLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    console.log("goint to repo");
    const user = await userRepository.findByUsername(username);
    console.log(user);
    console.log("!23");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const passwordMatch = await userRepository.comparePasswords(
      password,
      user.password
    );
    if (!passwordMatch) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }
    const role = user.isAdmin ? "admin" : "user";
    const token = generateToken(user.id, role);
    const refreshToken = generateRefreshToken(user.id);

    const { password: _, ...userData } = user; // Remove password before sending user data in response

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      refreshToken,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
export const googlelogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, firstName, lastName, username } = req.body;

    // Check if the email already exists in the database
    const user = await userRepository.findbyemail(email);
    if (user) {
      // Assuming the user is new and needs to be registered

      // Generate token for the new user
      console.log("generage");
      const token = generateToken(user._id, "user"); // Assuming generateToken function is defined correctly

      // res.status(200).json({ success: true, message: "User logged in successfully", token, user: user });
    } else {
      const password = generatePassword();
      const hashsedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: username,
        email: email,
        password: hashsedPassword,
        phone: "0987665",
      });

      const savedUser = await userRepository.saveUser(newUser);
      const user = await userRepository.findByUserDetails(newUser.username);
      if (user) {
        const token = generateToken(user.id, "user");
        res.status(200).json({
          success: true,
          message: "User registered successfully",
          userData: user,
          token,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found after registration",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const generatePassword = () => {
  return Math.random().toString(36).slice(2, 10);
};

export default generatePassword;
//fetch the all user details

export const fetchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("entering to fetch ysers ");
    const users = await userRepository.findUsers();
    console.log("users", users);
    res.status(200).json({
      success: true,
      message: "User signup  successfully",
      usersData: users,
    });
  } catch {}
};
export const fetchUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params;
    const users = await userRepository.findUsers();

    res.status(200).json({
      success: true,
      message: "User signup  successfully",
      usersData: users,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// edit the user profile controller

export const editprofile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params; // Assuming you have the user ID in the request parameters
    const userData = req.body;
    const updatedData = await userRepository.updateUser(userId, userData);

    res.status(200).json({
      success: true,
      message: "profile updated succes fully ",
      userData: updatedData,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// to block and unblockk this user controller

export const block = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, isBlock } = req.body;
    // Call the repository method to block the user
    await userRepository.blockUser(userId, isBlock);
    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// verfiy email for forget the password

export const verifyemail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const emailExists = await userRepository.emailExists(email);

    if (!emailExists) {
      res.status(400).json({ error: "email is exist" });
    }

    res.status(200).json({ success: true, message: "email verified" });
    await emailVerification(email);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// verify the otp for for get password

export const verifyEmailOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { otp } = req.body;

    if (otp == otpVal) {
      res.status(200).json({ success: true, message: "otp verified" });
    } else {
      res.status(400).json({ success: false, error: "Incorrect OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

//change password logic

export const changepassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call the changepassword function with the new password and email
    const user = await userRepository.changepassword(hashedPassword, email);

    if (user) {
      // If user is found and password is updated successfully
      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } else {
      // If user is not found
      res.status(404).json({ success: false, error: "User not found" });
    }
  } catch (error) {
    //   Catch any errors that occur during the process
    res.status(500).json({ error: "Something went wrong" });
  }
};

// resend otp logic

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.body.userData.email;
    await emailVerification(email);

    // Extract email and password from request body
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// followUser
export const followUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { followerId } = req.body;
    await User.findByIdAndUpdate(followerId, { $push: { following: userId } });

    await User.findByIdAndUpdate(userId, { $push: { followers: followerId } });
    await notificationRepository.saveNotification(userId, followerId, "follow");

    res
      .status(200)
      .json({ success: true, message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const unfollowUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { followerId } = req.body;
    await User.findByIdAndUpdate(followerId, { $pull: { following: userId } });

    await User.findByIdAndUpdate(userId, { $pull: { followers: followerId } });

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const UserSuggestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const suggestions = await userRepository.UserSuggestions(userId);
    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { userId: string };
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const role = user.isAdmin ? "admin" : "user";
    const newAccessToken = generateToken(user.id, role);
    const newRefreshToken = generateRefreshToken(user.id);

    res
      .status(200)
      .json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
