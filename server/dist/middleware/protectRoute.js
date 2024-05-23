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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authorizationHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                // Token has expired
                return res.status(401).json({ error: "Token expired" });
            }
            else {
                // Other JWT verification errors
                console.error("Failed to authenticate token:", err);
                return res.status(401).json({ error: "Failed to authenticate token" });
            }
        }
        if (!decoded || !decoded.role) {
            return res.status(400).json({ error: 'Invalid token structure or missing role information' });
        }
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    });
};
exports.verifyToken = verifyToken;
// authorizeRole middleware
const authorizeRole = (requiredRole) => (req, res, next) => {
    if (!req.user || !req.user.role || !req.user.role.includes(requiredRole)) {
        res.status(400);
        throw new Error('Insufficient permissions to access this resource');
    }
    next();
};
exports.authorizeRole = authorizeRole;
