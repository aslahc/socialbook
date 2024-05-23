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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.UserSuggestions = exports.unfollowUser = exports.followUser = exports.resendOtp = exports.changepassword = exports.verifyEmailOtp = exports.verifyemail = exports.block = exports.editprofile = exports.fetchUser = exports.fetchUsers = exports.googlelogin = exports.verifyLogin = exports.verifyOtp = exports.emailVerification = exports.signUp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const UserRepository_1 = require("../repositories/UserRepository");
const Notifcation_1 = require("../repositories/Notifcation");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const jwtTocken_1 = require("../utils/jwtTocken");
const jwtTocken_2 = require("../utils/jwtTocken");
dotenv_1.default.config();
const user_1 = __importDefault(require("../models/user/user"));
const userRepository = new UserRepository_1.UserRepository();
const notificationRepository = new Notifcation_1.NotificationRepository();
// user signup controller
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, phone } = req.body;
    try {
        const existUsername = yield userRepository.usernameExists(username);
        if (existUsername) {
            res.status(400).json({ error: "Username already exists" });
        }
        const emailExists = yield userRepository.emailExists(email);
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
        yield (0, exports.emailVerification)(email);
        // Additional logic or response handling here
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
        // Handle the error or send an appropriate response
    }
});
exports.signUp = signUp;
// nodemailer code for otp
let otpVal;
const emailVerification = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        otpVal = Math.floor(Math.random() * 10000).toString();
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
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
        let info = yield transporter.sendMail(mailOptions);
    }
    catch (_a) { }
});
exports.emailVerification = emailVerification;
// verify the otp
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, userData } = req.body;
        if (otp !== otpVal) {
            res.status(400).json({ success: false, message: "Incorrect OTP" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
        const newUser = new user_1.default({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            phone: userData.phone,
        });
        const savedUser = yield userRepository.saveUser(newUser);
        const user = yield userRepository.findByUserDetails(userData.username);
        if (user) {
            const token = (0, jwtTocken_1.generateToken)(user.id, "user");
            res.status(200).json({
                success: true,
                message: "User registered successfully",
                userData: user,
                token,
            });
        }
        else {
            res
                .status(404)
                .json({ success: false, message: "User not found after registration" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.verifyOtp = verifyOtp;
// verify the login
const verifyLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        console.log("goint to repo");
        const user = yield userRepository.findByUsername(username);
        console.log(user);
        console.log("!23");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const passwordMatch = yield userRepository.comparePasswords(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: "Incorrect password" });
            return;
        }
        const role = user.isAdmin ? "admin" : "user";
        const token = (0, jwtTocken_1.generateToken)(user.id, role);
        const refreshToken = (0, jwtTocken_2.generateRefreshToken)(user.id);
        const { password: _ } = user, userData = __rest(user, ["password"]); // Remove password before sending user data in response
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            refreshToken,
            user: userData,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.verifyLogin = verifyLogin;
const googlelogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, username } = req.body;
        // Check if the email already exists in the database
        const user = yield userRepository.findbyemail(email);
        if (user) {
            // Assuming the user is new and needs to be registered
            // Generate token for the new user
            console.log("generage");
            const token = (0, jwtTocken_1.generateToken)(user._id, "user"); // Assuming generateToken function is defined correctly
            // res.status(200).json({ success: true, message: "User logged in successfully", token, user: user });
        }
        else {
            const password = generatePassword();
            const hashsedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = new user_1.default({
                username: username,
                email: email,
                password: hashsedPassword,
                phone: "0987665",
            });
            const savedUser = yield userRepository.saveUser(newUser);
            const user = yield userRepository.findByUserDetails(newUser.username);
            if (user) {
                const token = (0, jwtTocken_1.generateToken)(user.id, "user");
                res.status(200).json({
                    success: true,
                    message: "User registered successfully",
                    userData: user,
                    token,
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "User not found after registration",
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.googlelogin = googlelogin;
const generatePassword = () => {
    return Math.random().toString(36).slice(2, 10);
};
exports.default = generatePassword;
//fetch the all user details
const fetchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userRepository.findUsers();
        res.status(200).json({
            success: true,
            message: "User signup  successfully",
            usersData: users,
        });
    }
    catch (_b) { }
});
exports.fetchUsers = fetchUsers;
const fetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params;
        const users = yield userRepository.findUsers();
        res.status(200).json({
            success: true,
            message: "User signup  successfully",
            usersData: users,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.fetchUser = fetchUser;
// edit the user profile controller
const editprofile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params; // Assuming you have the user ID in the request parameters
        const userData = req.body;
        const updatedData = yield userRepository.updateUser(userId, userData);
        res.status(200).json({
            success: true,
            message: "profile updated succes fully ",
            userData: updatedData,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.editprofile = editprofile;
// to block and unblockk this user controller
const block = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, isBlock } = req.body;
        // Call the repository method to block the user
        yield userRepository.blockUser(userId, isBlock);
        res.status(200).json({ message: "User blocked successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.block = block;
// verfiy email for forget the password
const verifyemail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const emailExists = yield userRepository.emailExists(email);
        if (!emailExists) {
            res.status(400).json({ error: "email is exist" });
        }
        res.status(200).json({ success: true, message: "email verified" });
        yield (0, exports.emailVerification)(email);
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.verifyemail = verifyemail;
// verify the otp for for get password
const verifyEmailOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        if (otp == otpVal) {
            res.status(200).json({ success: true, message: "otp verified" });
        }
        else {
            res.status(400).json({ success: false, error: "Incorrect OTP" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.verifyEmailOtp = verifyEmailOtp;
//change password logic
const changepassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Call the changepassword function with the new password and email
        const user = yield userRepository.changepassword(hashedPassword, email);
        if (user) {
            // If user is found and password is updated successfully
            res
                .status(200)
                .json({ success: true, message: "Password changed successfully" });
        }
        else {
            // If user is not found
            res.status(404).json({ success: false, error: "User not found" });
        }
    }
    catch (error) {
        //   Catch any errors that occur during the process
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.changepassword = changepassword;
// resend otp logic
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.userData.email;
        yield (0, exports.emailVerification)(email);
        // Extract email and password from request body
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.resendOtp = resendOtp;
// followUser
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { followerId } = req.body;
        yield user_1.default.findByIdAndUpdate(followerId, { $push: { following: userId } });
        yield user_1.default.findByIdAndUpdate(userId, { $push: { followers: followerId } });
        yield notificationRepository.saveNotification(userId, followerId, "follow");
        res
            .status(200)
            .json({ success: true, message: "User followed successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.followUser = followUser;
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { followerId } = req.body;
        yield user_1.default.findByIdAndUpdate(followerId, { $pull: { following: userId } });
        yield user_1.default.findByIdAndUpdate(userId, { $pull: { followers: followerId } });
        res.status(200).json({ message: "User unfollowed successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.unfollowUser = unfollowUser;
const UserSuggestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const suggestions = yield userRepository.UserSuggestions(userId);
        res.status(200).json({ success: true, suggestions });
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.UserSuggestions = UserSuggestions;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ error: "No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = yield userRepository.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        const role = user.isAdmin ? "admin" : "user";
        const newAccessToken = (0, jwtTocken_1.generateToken)(user.id, role);
        const newRefreshToken = (0, jwtTocken_2.generateRefreshToken)(user.id);
        res
            .status(200)
            .json({ token: newAccessToken, refreshToken: newRefreshToken });
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.refreshToken = refreshToken;
