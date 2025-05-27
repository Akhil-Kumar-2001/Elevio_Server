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
const passwordUtility_1 = __importDefault(require("../../../utils/passwordUtility"));
const mailUtility_1 = __importDefault(require("../../../utils/mailUtility"));
const otpUtility_1 = __importDefault(require("../../../utils/otpUtility"));
const tokenUtility_1 = require("../../../utils/tokenUtility");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const statusCode_1 = require("../../../constants/statusCode");
class TutorController {
    constructor(tutorService) {
        this._tutorService = tutorService;
    }
    signupPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, email, password } = req.body;
                if (!username || !email || !password) {
                    res
                        .status(statusCode_1.STATUS_CODES.BAD_REQUEST)
                        .json({ message: "Username, Email and Password is Required" });
                    return;
                }
                const existingUser = yield this._tutorService.findByEmail(email);
                console.log("this is existing user", existingUser);
                if (existingUser) {
                    if (existingUser.status === 0) {
                        password = yield passwordUtility_1.default.passwordHash(password);
                        const updatedUser = yield this._tutorService.updateUser(email, {
                            username,
                            password,
                        });
                        const otp = (yield otpUtility_1.default.otpGenerator()).toString();
                        const oldOtp = yield this._tutorService.getOtpByEmail(email);
                        if (oldOtp) {
                            yield this._tutorService.storeUserResendOtp(email, otp);
                        }
                        else {
                            yield this._tutorService.storeUserOtp(email, otp);
                        }
                        try {
                            yield mailUtility_1.default.sendMail(email, otp, "Verification otp");
                            res.status(statusCode_1.STATUS_CODES.OK).json({
                                message: "Otp sent to the mail",
                                email,
                            });
                        }
                        catch (error) {
                            console.error("Failed to send otp", error);
                            res
                                .status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR)
                                .json({ message: "Failed to send the verification mail." });
                        }
                        return;
                    }
                    else {
                        res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ message: "User already exist." });
                        return;
                    }
                }
                password = yield passwordUtility_1.default.passwordHash(password);
                const newUser = yield this._tutorService.createUser(username, email, password);
                const otp = (yield otpUtility_1.default.otpGenerator()).toString();
                const oldOtp = yield this._tutorService.getOtpByEmail(email);
                if (oldOtp) {
                    yield this._tutorService.storeUserResendOtp(email, otp);
                }
                else {
                    yield this._tutorService.storeUserOtp(email, otp);
                }
                try {
                    yield mailUtility_1.default.sendMail(email, otp, "Verification otp");
                    res.status(statusCode_1.STATUS_CODES.OK).json({
                        message: "Otp sent to the given mail id",
                        email,
                        otp,
                    });
                }
                catch (error) {
                    console.error("Failed to send otp", error);
                    res
                        .status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR)
                        .json({ message: "Failed to send the verification mail" });
                }
            }
            catch (error) {
                console.error("Error during signup:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: `Error while adding user: ${error}` });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp, email } = req.body;
            if (!otp) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: "Otp is required" });
                return;
            }
            if (!otp || !email) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: "OTP Timeout. Try again" });
                return;
            }
            const response = yield this._tutorService.getOtpByEmail(email);
            const storedOtp = response === null || response === void 0 ? void 0 : response.otp;
            if (storedOtp === otp) {
                let currentUser = yield this._tutorService.findByEmail(email);
                if (!currentUser) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ message: "User not found" });
                    return;
                }
                const userData = Object.assign(Object.assign({}, currentUser.toObject()), { status: 1 });
                const updatedUser = yield this._tutorService.updateUser(email, userData);
                if (updatedUser) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({
                        message: "Otp Verified Successfully",
                    });
                }
                else {
                    res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                        message: "Error while updating user data",
                    });
                }
            }
            else {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({
                    message: "Incorrect otp Please try again later",
                });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const otp = (yield otpUtility_1.default.otpGenerator()).toString();
            yield this._tutorService.storeUserResendOtp(email, otp);
            try {
                yield mailUtility_1.default.sendMail(email, otp, "Verification otp");
                res.status(statusCode_1.STATUS_CODES.OK).json({
                    message: "Otp sent to the given mail id",
                    email,
                    otp,
                });
            }
            catch (error) {
                console.error("Failed to send otp", error);
                res
                    .status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR)
                    .json({ message: "Failed to send the verification mail" });
            }
        });
    }
    signinPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check email and password valid
                // check existing user or not if not tell to signup
                // if it is existing user check the user is blocked or not
                // then compare the password
                // if password correct create access and refresh token
                // store those token in cookie
                const { email, password } = req.body;
                if (!email || !password) {
                    res
                        .status(statusCode_1.STATUS_CODES.BAD_REQUEST)
                        .json({
                        success: false,
                        message: "Email and password required",
                        data: null
                    });
                }
                const user = yield this._tutorService.findByEmail(email);
                if (!user) {
                    res
                        .status(statusCode_1.STATUS_CODES.NOT_FOUND)
                        .json({
                        success: false,
                        message: "User not found Signup first to login",
                        data: null
                    });
                    return;
                }
                if (!(user === null || user === void 0 ? void 0 : user.status)) {
                    res
                        .status(statusCode_1.STATUS_CODES.FORBIDDEN)
                        .json({
                        success: false,
                        message: "Your Account is Blocked",
                        data: null
                    });
                    return;
                }
                if (!user.password) {
                    res
                        .status(statusCode_1.STATUS_CODES.NOT_FOUND)
                        .json({
                        success: false,
                        message: "Password is not set for this account",
                        data: null
                    });
                    return;
                }
                if (user.status === 0) {
                    res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ success: false, message: "OTP not verfied in Signup", data: null });
                    return;
                }
                if (user.status === -1) {
                    res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ success: false, message: "User is Blocked by the admin", data: null });
                    return;
                }
                const comparePassword = yield passwordUtility_1.default.comparePassword(password, user === null || user === void 0 ? void 0 : user.password);
                if (!comparePassword) {
                    res
                        .status(statusCode_1.STATUS_CODES.UNAUTHORIZED)
                        .json({
                        success: false,
                        message: "Invalid email or password",
                        data: null,
                    });
                    return;
                }
                if (user === null || user === void 0 ? void 0 : user.id) {
                    const tokenInstance = new tokenUtility_1.Token();
                    const { accessToken, refreshToken } = tokenInstance.generatingTokens(user.id, user.role);
                    console.log("Accesstoken : ", accessToken);
                    console.log("Refreshtoken : ", refreshToken);
                    const filteredData = {
                        id: user._id,
                        role: user.role,
                    };
                    if (accessToken && refreshToken) {
                        res.cookie("refreshToken", refreshToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                            domain: ".elevic.site",
                            path: "/",
                            maxAge: 2 * 24 * 60 * 60 * 1000,
                        });
                        res.cookie("accessToken", accessToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                            domain: ".elevic.site",
                            path: "/",
                            maxAge: 15 * 60 * 1000,
                        });
                        res
                            .status(statusCode_1.STATUS_CODES.OK)
                            .json({
                            successs: true,
                            message: "Sign-in successful",
                            data: { accessToken, user: filteredData, verificationStatus: user.isVerified }
                        });
                        return;
                    }
                    else {
                        res.status(statusCode_1.STATUS_CODES.UNAUTHORIZED).json({
                            success: false,
                            message: "Invalid credentials"
                        });
                        return;
                    }
                }
                else {
                    res
                        .status(statusCode_1.STATUS_CODES.UNAUTHORIZED)
                        .json({
                        success: false,
                        message: "Invalid Credentials"
                    });
                    return;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
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
                    const tokenInstance = new tokenUtility_1.Token();
                    const { userId, role } = decoded;
                    const newAccessToken = tokenInstance.generatingTokens(userId, role).accessToken;
                    res.cookie("accessToken", newAccessToken, {
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
                res.clearCookie("accessToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: ".elevic.site",
                    path: "/"
                });
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: ".elevic.site",
                    path: "/"
                });
                res.status(statusCode_1.STATUS_CODES.OK).json({
                    success: true,
                    message: "Logout successful",
                });
                return;
            }
            catch (error) {
                console.error("Logout error:", error);
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ error: "logout failed" });
                return;
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.body;
                if (!email) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Email is Required", data: null });
                    return;
                }
                const user = yield this._tutorService.findByEmail(email);
                if (!user) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ success: false, message: "User not found.", data: null });
                    return;
                }
                if (user.status === 1) {
                    const otp = (yield otpUtility_1.default.otpGenerator()).toString();
                    const oldOtp = yield this._tutorService.getOtpByEmail(email);
                    if (oldOtp) {
                        yield this._tutorService.storeUserResendOtp(email, otp);
                    }
                    else {
                        yield this._tutorService.storeUserOtp(email, otp);
                    }
                    try {
                        yield mailUtility_1.default.sendMail(email, otp, "Verification otp");
                        res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "OTP sent to the given email", email });
                    }
                    catch (error) {
                        console.error("Failed to send OTP:", error);
                        res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to send the verification mail", data: null });
                    }
                }
                else if (user.status === -1) {
                    res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ success: false, message: "User is blocked by the admin" });
                }
                else {
                    res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ success: false, message: "User is not verified" });
                }
            }
            catch (error) {
                console.error("Error in forgotPassword:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false, message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    verifyForgotOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, email } = req.body;
                if (!otp) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: "OTP is required" });
                    return;
                }
                if (!email) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: "Email is required" });
                    return;
                }
                const response = yield this._tutorService.getOtpByEmail(email);
                if (!response) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: "OTP Timeout. Try again" });
                    return;
                }
                const storedOtp = response.otp;
                if (storedOtp !== otp) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: "Incorrect OTP" });
                    return;
                }
                const currentUser = yield this._tutorService.findByEmail(email);
                if (!currentUser) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ message: "User not found" });
                    return;
                }
                if (currentUser.status === -1) {
                    res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ success: false, message: "User is blocked by admin" });
                    return;
                }
                if (currentUser.status === 0) {
                    res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ success: false, message: "User is not verified" });
                    return;
                }
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "OTP verified successfully", email });
            }
            catch (error) {
                console.error("Error verifying OTP:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, email } = req.body;
                // Find user by email
                const user = yield this._tutorService.findByEmail(email);
                if (!user) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ success: false, message: "User not found", data: null });
                    return;
                }
                const hashedPassword = yield passwordUtility_1.default.passwordHash(password);
                const userData = Object.assign(Object.assign({}, user.toObject()), { password: hashedPassword });
                const updatedUser = yield this._tutorService.updateUser(email, userData);
                if (updatedUser) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Reset Password Successful", });
                }
                else {
                    res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while resetting the password", });
                }
            }
            catch (error) {
                console.error("Error in resetPassword:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false, message: "Internal Server Error",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, image } = req.body;
                if (!username || !email || !image) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "credential need to login", data: null });
                    return;
                }
                let user = yield this._tutorService.findByEmail(email);
                if ((user === null || user === void 0 ? void 0 : user.status) == -1) {
                    res.status(statusCode_1.STATUS_CODES.FORBIDDEN).json({ success: false, message: "user is blocked by the admin", data: null });
                    return;
                }
                if (!user) {
                    const password = yield passwordUtility_1.default.passwordHash(username);
                    user = yield this._tutorService.createGoogleUser(username, email, password, image); // Assign to 'user'
                }
                if (!user) {
                    res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to create user", data: null });
                    return;
                }
                const userData = Object.assign(Object.assign({}, user.toObject()), { status: 1 });
                const updatedUser = yield this._tutorService.updateUser(email, userData);
                const tokenInstance = new tokenUtility_1.Token();
                const { accessToken, refreshToken } = tokenInstance.generatingTokens(user.id, user.role);
                console.log("Accesstoken : ", accessToken);
                console.log("Refreshtoken : ", refreshToken);
                const filteredData = {
                    id: user._id,
                    role: user.role,
                };
                if (accessToken && refreshToken) {
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        domain: ".elevic.site",
                        path: "/",
                        maxAge: 24 * 60 * 60 * 1000,
                    });
                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        domain: ".elevic.site",
                        path: "/",
                        maxAge: 15 * 60 * 1000,
                    });
                    res
                        .status(statusCode_1.STATUS_CODES.OK)
                        .json({
                        success: true, message: "Sign-in successful", data: { accessToken, user: filteredData, verificationStatus: user.isVerified }
                    });
                    console.log("User signin successfull tutor  ");
                    return;
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error", data: null });
            }
        });
    }
}
exports.default = TutorController;
