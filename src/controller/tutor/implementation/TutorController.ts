import ITutorService from "../../../service/tutor/ITutorService";
import { Request, Response } from "express";
import PasswordUtils from "../../../utils/passwordUtility";
import MailUtility from "../../../utils/mailUtility";
import OtpUtility from "../../../utils/otpUtility";
import { ITutor } from "../../../model/tutor/tutorModel";
import { Token } from "../../../utils/tokenUtility";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { STATUS_CODES } from "../../../constants/statusCode";
import ITutorController from "../ITutorController";

class TutorController implements ITutorController {
    private _tutorService: ITutorService

    constructor(tutorService: ITutorService) {
        this._tutorService = tutorService
    }

    async signupPost(req: Request, res: Response): Promise<void> {
        try {
            let { username, email, password } = req.body;

            if (!username || !email || !password) {
                res
                    .status(STATUS_CODES.BAD_REQUEST)
                    .json({ message: "Username, Email and Password is Required" });
                return;
            }
            const existingUser = await this._tutorService.findByEmail(email);
            console.log("this is existing user", existingUser)
            if (existingUser) {
                if (existingUser.status === 0) {
                    password = await PasswordUtils.passwordHash(password);
                    const updatedUser = await this._tutorService.updateUser(email, {
                        username,
                        password,
                    } as ITutor);

                    const otp = (await OtpUtility.otpGenerator()).toString();

                    const oldOtp = await this._tutorService.getOtpByEmail(email);

                    if (oldOtp) {
                        await this._tutorService.storeUserResendOtp(email, otp)
                    } else {
                        await this._tutorService.storeUserOtp(email, otp);
                    }


                    try {
                        await MailUtility.sendMail(email, otp, "Verification otp");

                        res.status(STATUS_CODES.OK).json({
                            message: "Otp sent to the mail",
                            email,
                        });
                    } catch (error) {
                        console.error("Failed to send otp", error);
                        res
                            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
                            .json({ message: "Failed to send the verification mail." });
                    }
                    return;
                }
                else {
                    res.status(STATUS_CODES.CONFLICT).json({ message: "User already exist." });
                    return;
                }
            }
            password = await PasswordUtils.passwordHash(password);
            const newUser = await this._tutorService.createUser(
                username,
                email,
                password
            );

            const otp = (await OtpUtility.otpGenerator()).toString();

            const oldOtp = await this._tutorService.getOtpByEmail(email);

            if (oldOtp) {
                await this._tutorService.storeUserResendOtp(email, otp)
            } else {
                await this._tutorService.storeUserOtp(email, otp);
            }

            try {
                await MailUtility.sendMail(email, otp, "Verification otp");
                res.status(STATUS_CODES.OK).json({
                    message: "Otp sent to the given mail id",
                    email,
                    otp,
                });
            } catch (error) {
                console.error("Failed to send otp", error);
                res
                    .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
                    .json({ message: "Failed to send the verification mail" });
            }
        } catch (error) {
            console.error("Error during signup:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: `Error while adding user: ${error}` });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const { otp, email } = req.body;
        if (!otp) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Otp is required" });
            return;
        }
        if (!otp || !email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: "OTP Timeout. Try again" });
            return;
        }

        const response = await this._tutorService.getOtpByEmail(email);

        const storedOtp = response?.otp;

        if (storedOtp === otp) {
            let currentUser = await this._tutorService.findByEmail(email);
            if (!currentUser) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: "User not found" });
                return;
            }

            const userData: ITutor = { ...currentUser.toObject(), status: 1 };

            const updatedUser = await this._tutorService.updateUser(
                email,
                userData
            );

            if (updatedUser) {
                res.status(STATUS_CODES.OK).json({
                    message: "Otp Verified Successfully",
                });
            } else {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    message: "Error while updating user data",
                });
            }
        } else {
            res.status(STATUS_CODES.BAD_REQUEST).json({
                message: "Incorrect otp Please try again later",
            });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {

        const { email } = req.body;

        const otp = (await OtpUtility.otpGenerator()).toString();
        await this._tutorService.storeUserResendOtp(email, otp)

        try {
            await MailUtility.sendMail(email, otp, "Verification otp");
            res.status(STATUS_CODES.OK).json({
                message: "Otp sent to the given mail id",
                email,
                otp,
            });
        } catch (error) {
            console.error("Failed to send otp", error);
            res
                .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to send the verification mail" });
        }
    }

    async signinPost(req: Request, res: Response): Promise<void> {
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
                    .status(STATUS_CODES.BAD_REQUEST)
                    .json({
                        success: false,
                        message: "Email and password required",
                        data: null
                    })
            }

            const user = await this._tutorService.findByEmail(email);

            if (!user) {
                res
                    .status(STATUS_CODES.NOT_FOUND)
                    .json({
                        success: false,
                        message: "User not found Signup first to login",
                        data: null
                    })
                return
            }

            if (!user?.status) {
                res
                    .status(STATUS_CODES.FORBIDDEN)
                    .json({
                        success: false,
                        message: "Your Account is Blocked",
                        data: null
                    })
                return
            }
            if (!user.password) {
                res
                    .status(STATUS_CODES.NOT_FOUND)
                    .json({
                        success: false,
                        message: "Password is not set for this account",
                        data: null
                    })
                return
            }
            if (user.status === 0) {
                res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: "OTP not verfied in Signup", data: null })
                return
            }
            if (user.status === -1) {
                res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: "User is Blocked by the admin", data: null })
                return
            }
            const comparePassword = await PasswordUtils.comparePassword(password, user?.password)

            if (!comparePassword) {
                res
                    .status(STATUS_CODES.UNAUTHORIZED)
                    .json({
                        success: false,
                        message: "Invalid email or password",
                        data: null,
                    });
                return;
            }


            if (user?.id) {
                const tokenInstance = new Token();
                const { accessToken, refreshToken } = tokenInstance.generatingTokens(user.id, user.role);
                console.log("Accesstoken : ", accessToken)
                console.log("Refreshtoken : ", refreshToken)
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
                        .status(STATUS_CODES.OK)
                        .json({
                            successs: true,
                            message: "Sign-in successful",
                            data: { accessToken, user: filteredData, verificationStatus: user.isVerified }
                        });
                    return
                } else {
                    res.status(STATUS_CODES.UNAUTHORIZED).json({
                        success: false,
                        message: "Invalid credentials"
                    });
                    return;
                }
            } else {
                res
                    .status(STATUS_CODES.UNAUTHORIZED)
                    .json({
                        success: false,
                        message: "Invalid Credentials"
                    });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, message: 'Refresh token missing' });
                return
            }

            // **Verify the refresh token**
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: unknown, decoded: JwtPayload | string  | undefined) => {
                if (err) {
                    return res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: 'Invalid refresh token' });
                }

                // Generate a new access token
                const tokenInstance = new Token();
                const {userId, role} = decoded as {role:string,userId:string}
                const newAccessToken = tokenInstance.generatingTokens(userId, role).accessToken;

                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: ".elevic.site",
                    path: "/",
                    maxAge: 15 * 60 * 1000,
                });
                res.status(STATUS_CODES.OK).json({ success: true, accessToken: newAccessToken });
            });
        } catch (error) {
            console.error('Error refreshing token:', error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    };
    async logout(req: Request, res: Response): Promise<void> {

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
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Logout successful",
            });
            return
        } catch (error) {
            console.error("Logout error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({ error: "logout failed" });
            return
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            let { email } = req.body;

            if (!email) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Email is Required", data: null });
                return;
            }

            const user = await this._tutorService.findByEmail(email);
            if (!user) {
                res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: "User not found.", data: null });
                return
            }

            if (user.status === 1) {
                const otp = (await OtpUtility.otpGenerator()).toString();
                const oldOtp = await this._tutorService.getOtpByEmail(email);

                if (oldOtp) {
                    await this._tutorService.storeUserResendOtp(email, otp);
                } else {
                    await this._tutorService.storeUserOtp(email, otp);
                }

                try {
                    await MailUtility.sendMail(email, otp, "Verification otp");
                    res.status(STATUS_CODES.OK).json({ success: true, message: "OTP sent to the given email", email });
                } catch (error) {
                    console.error("Failed to send OTP:", error);
                    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to send the verification mail", data: null });
                }
            } else if (user.status === -1) {
                res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: "User is blocked by the admin" });
            } else {
                res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: "User is not verified" });
            }
        } catch (error) {
            console.error("Error in forgotPassword:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false, message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async verifyForgotOtp(req: Request, res: Response): Promise<void> {
        try {
            const { otp, email } = req.body;

            if (!otp) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "OTP is required" });
                return;
            }
            if (!email) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Email is required" });
                return;
            }
            const response = await this._tutorService.getOtpByEmail(email);
            if (!response) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "OTP Timeout. Try again" });
                return;
            }
            const storedOtp = response.otp;

            if (storedOtp !== otp) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Incorrect OTP" });
                return;
            }

            const currentUser = await this._tutorService.findByEmail(email);

            if (!currentUser) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: "User not found" });
                return;
            }

            if (currentUser.status === -1) {
                res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: "User is blocked by admin" });
                return;
            }

            if (currentUser.status === 0) {
                res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: "User is not verified" });
                return;
            }

            res.status(STATUS_CODES.OK).json({ success: true, message: "OTP verified successfully", email });

        } catch (error) {
            console.error("Error verifying OTP:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { password, email } = req.body;

            // Find user by email
            const user = await this._tutorService.findByEmail(email);
            if (!user) {
                res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: "User not found", data: null });
                return
            }
            const hashedPassword = await PasswordUtils.passwordHash(password);
            const userData: ITutor = { ...user.toObject(), password: hashedPassword };
            const updatedUser = await this._tutorService.updateUser(email, userData);

            if (updatedUser) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Reset Password Successful", });
            } else {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while resetting the password", });
            }
        } catch (error) {
            console.error("Error in resetPassword:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false, message: "Internal Server Error",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }


    async googleAuth(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, image } = req.body;
            if (!username || !email || !image) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: "credential need to login", data: null });
                return;
            }
            let user = await this._tutorService.findByEmail(email);

            if (user?.status == -1) {
                res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: "user is blocked by the admin", data: null })
                return
            }

            if (!user) {
                const password = await PasswordUtils.passwordHash(username);
                user = await this._tutorService.createGoogleUser(username, email, password, image);  // Assign to 'user'
            }

            if (!user) {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to create user", data: null });
                return;
            }

            const userData: ITutor = { ...user.toObject(), status: 1 };

            const updatedUser = await this._tutorService.updateUser(
                email,
                userData
            );

            const tokenInstance = new Token();
            const { accessToken, refreshToken } = tokenInstance.generatingTokens(user.id, user.role);
            console.log("Accesstoken : ", accessToken)
            console.log("Refreshtoken : ", refreshToken)
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
                    .status(STATUS_CODES.OK)
                    .json({
                        success: true, message: "Sign-in successful", data: { accessToken, user: filteredData, verificationStatus: user.isVerified }
                    });
                console.log("User signin successfull tutor  ")
                return

            }
        } catch (error) {
            console.error(error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error", data: null });
        }
    }


}

export default TutorController