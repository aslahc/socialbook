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
exports.MessageRepository = void 0;
const message_1 = __importDefault(require("../models/chat/message"));
const conversation_1 = __importDefault(require("../models/chat/conversation"));
const mongoose_1 = require("mongoose");
class MessageRepository {
    create(conversationId, sender, text, reciver, timestamp, messageType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = new message_1.default({
                    conversationId: conversationId,
                    sender: sender,
                    reciver: reciver,
                    text: text,
                    messageType: messageType,
                    timestamp: timestamp,
                });
                return yield newMessage.save();
            }
            catch (error) {
                throw new Error(`Failed to create message: ${error}`);
            }
        });
    }
    findMessagesByUserId(userId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversation = yield conversation_1.default.findOne({
                    members: {
                        $all: [new mongoose_1.Types.ObjectId(userId), new mongoose_1.Types.ObjectId(receiverId)],
                    },
                });
                if (!conversation) {
                    // If no conversation found, return an empty array
                    return [];
                }
                // Find messages for the conversation
                const messages = yield message_1.default.find({
                    conversationId: conversation._id,
                }).sort({ createdAt: 1 });
                return messages;
            }
            catch (error) {
                throw new Error(`Failed to fetch messages for user ${userId}: ${error}`);
            }
        });
    }
}
exports.MessageRepository = MessageRepository;
