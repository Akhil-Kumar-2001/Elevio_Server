"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Token {
    constructor() {
        this.JWT_Key = process.env.JWT_SECRET;
        this.refreshSecret = process.env.REFRESH_TOKEN_SECRET || " ";
    }
    generatingTokens(userId, role) {
        const accessToken = jsonwebtoken_1.default.sign({ userId, role }, // Adding role 
        this.JWT_Key, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({ userId, role }, // Adding role 
        this.refreshSecret, { expiresIn: "7d" });
        return { accessToken, refreshToken };
    }
}
exports.Token = Token;
