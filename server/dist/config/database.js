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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const url = "mongodb://aslahcholasseri:8zjovjFZOawzwqBD@ac-312hnlu-shard-00-00.qrndvrf.mongodb.net:27017,ac-312hnlu-shard-00-01.qrndvrf.mongodb.net:27017,ac-312hnlu-shard-00-02.qrndvrf.mongodb.net:27017/socialmedia?ssl=true&replicaSet=atlas-ozmy3b-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
const connectToMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGODB_URL || url);
        console.log(url, "mm ");
        console.log(process.env.MONGODB_URL, "ff");
        console.log("connected to mongoDB ++");
    }
    catch (error) {
        console.log("Error while connecting to mongoDB");
    }
});
exports.default = connectToMongoDB;
