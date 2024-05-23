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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dismmisNotification = exports.notifications = void 0;
const Notifcation_1 = require("../repositories/Notifcation");
const notificationRepository = new Notifcation_1.NotificationRepository();
const notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const notifications = yield notificationRepository.findNotifications(userId);
        res.status(200).json({ succuss: true, notifications });
        // Additional logic or response handling here
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
        // Handle the error or send an appropriate response
    }
});
exports.notifications = notifications;
const dismmisNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = req.params.id;
        const notificationData = yield notificationRepository.deleteNotification(notification);
        if (notificationData) {
            res.status(200).json({ succuss: true, message: "notification delete " });
        }
        // Additional logic or response handling here
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
        // Handle the error or send an appropriate response
    }
});
exports.dismmisNotification = dismmisNotification;
