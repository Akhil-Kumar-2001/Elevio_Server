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
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateToken = (requiredRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const JWT_KEY = process.env.JWT_SECRET;
            let accessToken = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.accessToken);
            if (!accessToken) {
                res.status(401).json({ message: "Access token not found, please log in" });
                return;
            }
            jsonwebtoken_1.default.verify(accessToken, JWT_KEY, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log("acc", accessToken, err);
                    return res.status(403).json({ message: "Invalid or expired token, please log in again." });
                }
                if (!data) {
                    return res.status(403).json({ message: "Invalid token structure." });
                }
                const { role, userId } = data;
                // Check role
                if (requiredRole && role !== requiredRole) {
                    return res.status(403).json({ message: "Access denied: Insufficient permissions." });
                }
                console.log("Checking role of the user in middleware => ", role);
                req.userId = userId;
                req.role = role;
                next();
            }));
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });
};
exports.validateToken = validateToken;
