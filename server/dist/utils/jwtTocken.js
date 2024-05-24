"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, role) => {
    const stringUserId = userId.toString();
    const payload = {
        userId: stringUserId,
        role,
    };
    console.log("eneterd to jwt secret");
    console.log(process.env.JWT_SECRET, "sss......................");
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "nwL19kn732imVwEFvu2/fZOdX8ZUy5tP97zvUEK9hXQ=", { expiresIn: "5h" });
    console.log(token);
    return token;
};
exports.generateToken = generateToken;
const generateRefreshToken = (userId) => {
    const payload = { userId: userId.toString() };
    const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET ||
        "nwL19kn732imVwEFvu2/fZOdX8ZUy5tP97zvUEK9hXQ=", {
        expiresIn: "7d",
    }); // Refresh token with 7 days expiry
    return refreshToken;
};
exports.generateRefreshToken = generateRefreshToken;
