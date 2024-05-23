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
exports.NotificationRepository = void 0;
const Notification_1 = require("../models/Notification/Notification");
const mongoose_1 = __importDefault(require("mongoose"));
class NotificationRepository {
    saveNotification(userId, followerId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create a new notification document based on the schema
                const newNotification = new Notification_1.Notification({
                    sourceId: followerId, // Corrected typo: sorceId -> sourceId
                    receiverId: new mongoose_1.default.Types.ObjectId(userId),
                    type: type,
                });
                // Save the notification to the database
                const savedNotification = yield newNotification.save();
                return savedNotification;
            }
            catch (error) {
                throw new Error(`Failed to create notification: ${error}`);
            }
        });
    }
    findNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convert userId to ObjectId if receiverId is stored as ObjectId
                const objectId = mongoose_1.default.Types.ObjectId.createFromHexString(userId);
                // Use find to retrieve notifications where receiverId matches userId
                const notifications = yield Notification_1.Notification.find({ receiverId: objectId }).populate('sourceId');
                return notifications;
            }
            catch (error) {
                throw new Error(`Failed to fetch notifications: ${error}`);
            }
        });
    }
    deleteNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Notification_1.Notification.findByIdAndDelete(notificationId);
                return true;
            }
            catch (error) {
                throw new Error(`Failed to fetch notifications: ${error}`);
            }
        });
    }
}
exports.NotificationRepository = NotificationRepository;
