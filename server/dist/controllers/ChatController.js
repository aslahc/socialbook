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
exports.messages = exports.saveMessage = void 0;
const conversation_1 = __importDefault(require("../models/chat/conversation"));
const message_1 = __importDefault(require("../models/chat/message"));
const conversationRepo_1 = require("../repositories/conversationRepo");
const MessageRepository_1 = require("../repositories/MessageRepository");
const ConversationRepository = new conversationRepo_1.conversationRepo();
const messageRepository = new MessageRepository_1.MessageRepository();
const saveMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, messageText, reciver, timestamp, messageType } = req.body;
        let conversation = yield ConversationRepository.findOneByMember(_id);
        if (!conversation) {
            conversation = yield ConversationRepository.create([_id]);
        }
        yield messageRepository.create(conversation._id ? conversation._id.toString() : null, _id, messageText, reciver, timestamp, messageType);
        const conversationId = conversation._id
            ? conversation._id.toString()
            : null;
        res.status(200).json({
            success: true,
            message: "Message saved successfully",
            conversationId,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to save message" });
    }
});
exports.saveMessage = saveMessage;
const messages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, receiverId } = req.params;
        // Find conversation IDs where the current user is a member
        const userConversations = yield conversation_1.default.find({ members: userId });
        // Find conversation IDs where the receiver is a member
        const receiverConversations = yield conversation_1.default.find({
            members: receiverId,
        });
        // Extract conversation IDs from results
        const userConvIds = userConversations.map((conv) => conv._id);
        const receiverConvIds = receiverConversations.map((conv) => conv._id);
        // Find messages sent by the current user in their conversations
        const sentMessages = yield message_1.default.find({
            conversationId: { $in: userConvIds }, // Filter by conversations where the user is a member
            sender: userId, // Filter by sender (current user)
            reciver: receiverId, // Filter by receiver
        });
        // Find messages received by the current user in conversations with the receiver
        const receivedMessages = yield message_1.default.find({
            conversationId: { $in: receiverConvIds }, // Filter by conversation IDs where the receiver is a member
            sender: receiverId,
            reciver: userId,
            // Filter by sender (receiver)
        });
        res.status(200).json({ success: true, sentMessages, receivedMessages });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch messages" });
    }
});
exports.messages = messages;
