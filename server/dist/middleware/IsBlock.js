"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.isBlock = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user/user"));
const isBlock = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authorizationHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                return res.status(401).json({ error: "Token expired" });
            }
            else {
                console.error("Failed to authenticate token:", err);
                return res.status(401).json({ error: "Failed to authenticate token" });
            }
        }
        if (!decoded || !decoded.role || !decoded.userId) {
            return res.status(400).json({ error: 'Invalid token structure or missing role/userId information' });
        }
        // Fetch user from database based on userId
        try {
            const user = yield user_1.default.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (user.isBlock) {
                return res.status(403).json({ error: 'User is blocked' });
            }
            req.user = {
                userId: decoded.userId,
                role: decoded.role,
            };
            next();
        }
        catch (error) {
            console.error("Error fetching user from database:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }));
};
exports.isBlock = isBlock;
