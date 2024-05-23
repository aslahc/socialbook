"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const ReportPost_1 = require("../controllers/ReportPost");
const AdminCotroller_1 = require("../controllers/AdminCotroller");
const admin_route = (0, express_1.default)();
admin_route.put("/block", UserController_1.block);
admin_route.get("/fetchReport", ReportPost_1.fetchReport);
admin_route.post("/reportPost", ReportPost_1.reportPost);
admin_route.post("/blockPost", ReportPost_1.blockPost);
admin_route.get("/totalreport", AdminCotroller_1.totalReport);
admin_route.get("/Graphdata", AdminCotroller_1.Graphdata);
exports.default = admin_route;
