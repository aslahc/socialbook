import express from 'express';
const admin_route = express();

import {block} from '../controllers/UserController'


admin_route.put('/block',block)
export default admin_route;
