import express from "express";
import { block } from "../controllers/UserController";
import { fetchReport, reportPost, blockPost } from "../controllers/ReportPost";

const admin_route = express();
admin_route.put("/block", block);
admin_route.get("/fetchReport", fetchReport);
admin_route.post("/reportPost", reportPost);
admin_route.post("/blockPost", blockPost);
export default admin_route;
