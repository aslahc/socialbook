import express from "express";
import { block } from "../controllers/UserController";
import { fetchReport, reportPost, blockPost } from "../controllers/ReportPost";
import { totalReport, Graphdata } from '../controllers/AdminCotroller'
const admin_route = express();
admin_route.put("/block", block);
admin_route.get("/fetchReport", fetchReport);
admin_route.post("/reportPost", reportPost);
admin_route.post("/blockPost", blockPost);
admin_route.get('/totalreport', totalReport)
admin_route.get('/Graphdata', Graphdata)

export default admin_route;
