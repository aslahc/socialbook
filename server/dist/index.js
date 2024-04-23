"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
// import path from 'path'
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(
  (0, cors_1.default)({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow credentials (e.g., cookies)
  })
);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
mongoose_1.default.connect("mongodb://127.0.0.1:27017/socialmedia");
app.use("/", userRoute_1.default);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
