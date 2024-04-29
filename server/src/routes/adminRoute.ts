import express from 'express';
const admin_route = express();

import {block} from '../controllers/UserController'
import {fetchReport,reportPost,blockPost} from '../controllers/ReportPost'

admin_route.put('/block',block)
admin_route.get('/fetchReport',fetchReport)
admin_route.post('/reportPost',reportPost)
admin_route.post('/blockPost',blockPost)
export default admin_route;
