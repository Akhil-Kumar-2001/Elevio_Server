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
const tutorModel_1 = require("../model/tutor/tutorModel"); // Import Tutor model and type
const studentModel_1 = require("../model/student/studentModel"); // Import Student model and type
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isBlocked = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const JWT_KEY = process.env.JWT_SECRET;
        if (!JWT_KEY) {
            res.status(500).json({ message: "Server error: Missing JWT secret key." });
            return;
        }
        const accessToken = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.accessToken);
        if (!accessToken) {
            res.status(401).json({ message: "Access token not found, please log in" });
            return;
        }
        // 🔹 Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(accessToken, JWT_KEY);
        }
        catch (error) {
            console.log(error);
            res.status(403).json({ message: "Invalid or expired token, please log in again." });
            return;
        }
        // 🔹 Extract user ID and role
        const userId = decoded.userId;
        const role = decoded.role;
        if (!userId || !role) {
            res.status(403).json({ message: "Invalid token structure." });
            return;
        }
        // 🔹 Determine Schema type
        let Schema = null;
        if (role === "Tutor") {
            Schema = tutorModel_1.Tutor;
        }
        else if (role === "Student") {
            Schema = studentModel_1.Student;
        }
        // 🔹 Ensure Schema is not null before querying
        if (!Schema) {
            res.status(400).json({ message: "Invalid user role." });
            return;
        }
        // ✅ **Explicitly cast Schema to the correct Model type before calling findById**
        const user = yield Schema.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        // 🔹 Check if user is blocked
        if (user.status === -1) {
            res.status(403).json({ success: false, message: "Your account has been blocked" });
            return;
        }
        // Proceed to next middleware if user is not blocked
        next();
    }
    catch (error) {
        console.error("Error checking user status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.default = isBlocked;
