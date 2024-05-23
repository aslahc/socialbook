"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_1 = __importDefault(require("./socket/socket"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const database_1 = __importDefault(require("./config/database"));
require("dotenv").config();
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use((0, express_session_1.default)({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
}));
// Middleware
app.use((0, cors_1.default)({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(4000, {
    cors: { origin: "*" },
});
// Configure Socket.IO
(0, socket_1.default)(io);
// Routes
app.use("/api/admin", adminRoute_1.default);
app.use("/api/", userRoute_1.default);
// Error Handler Middleware (placed after all other middleware and routes)
(0, database_1.default)()
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Error while connecting to MongoDB:", error);
});
