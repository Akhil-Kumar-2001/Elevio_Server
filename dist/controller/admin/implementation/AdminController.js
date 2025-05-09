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
const adminTokenUtility_1 = require("../../../utils/adminTokenUtility");
const errorMessage_1 = require("../../../constants/errorMessage");
const statusCode_1 = require("../../../constants/statusCode");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AdminController {
    constructor(adminService) {
        this._adminService = adminService;
    }
    signinPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // check email and password valid
            // check existing user or not if not tell to signup
            // if it is existing user check the user is blocked or not
            // then compare the password
            // if password correct create access and refresh token
            // store those token in cookie
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.BAD_REQUEST, data: null });
                }
                if (process.env.ADMIN_MAIL == email && process.env.ADMIN_PASSWORD) {
                    const tokenInstance = new adminTokenUtility_1.Token();
                    const { accessToken, refreshToken } = tokenInstance.generatingTokens(email);
                    console.log("Accesstoken : ", accessToken);
                    console.log("Refreshtoken : ", refreshToken);
                    if (accessToken && refreshToken) {
                        res.cookie("admin-refreshToken", refreshToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                            domain: ".elevic.site",
                            path: "/",
                            maxAge: 2 * 24 * 60 * 60 * 1000,
                        });
                        res.cookie("admin-accessToken", accessToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                            domain: ".elevic.site",
                            path: "/",
                            maxAge: 15 * 60 * 1000,
                        });
                        res.status(statusCode_1.STATUS_CODES.OK).json({ successs: true, message: "Sign-in successful", data: { accessToken, user: { id: email, role: "admin" } } });
                        return;
                    }
                }
                else {
                    res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED, data: null });
                }
            }
            catch (error) {
                console.error("Error during signup:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies['admin-refreshToken'];
                if (!refreshToken) {
                    res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({ success: false, message: 'Refresh token missing' });
                    return;
                }
                // **Verify the refresh token**
                jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        return res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ success: false, message: 'Invalid refresh token' });
                    }
                    // Generate a new access token
                    const tokenInstance = new adminTokenUtility_1.Token();
                    const newAccessToken = tokenInstance.generatingTokens(decoded.id, decoded.role).accessToken;
                    console.log("new access token", newAccessToken);
                    res.cookie("admin-accessToken", newAccessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        domain: ".elevic.site",
                        path: "/",
                        maxAge: 15 * 60 * 1000,
                    });
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, accessToken: newAccessToken });
                });
            }
            catch (error) {
                console.error('Error refreshing token:', error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    ;
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("admin-accessToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.clearCookie("admin-refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Logout successful", });
                return;
            }
            catch (error) {
                console.error("Logout error:", error);
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ error: "logout failed" });
                return;
            }
        });
    }
    getStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const students = yield this._adminService.getStudents(page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Student data Retrived", data: students });
            }
            catch (error) {
                console.error("Error while retriving Student data.", error);
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Student data Retrived failed", data: null });
                return;
            }
        });
    }
    getTutors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const tutors = yield this._adminService.getTutors(page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Student data Retrived", data: tutors });
            }
            catch (error) {
                console.error("Error while retriving Tutors data.", error);
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Tutors data Retrived failed", data: null });
                return;
            }
        });
    }
    blockTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const response = yield this._adminService.blockTutor(id);
                console.log(response);
                if (response)
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Change status success", data: response });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const response = yield this._adminService.blockStudent(id);
                console.log(response);
                if (response)
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Change status success", data: response });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = AdminController;
