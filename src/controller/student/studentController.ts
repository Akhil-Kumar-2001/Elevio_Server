import IStudentService from "../../service/student/IStudentService";
import { Request, Response } from "express";
import OtpUtility from "../../utils/otpUtility";
import MailUtility from "../../utils/mailUtility";
import { Token } from "../../utils/tokenUtility";
import PasswordUtils from "../../utils/passwordUtility";
import { IStudent } from "../../model/student/studentModel";
import jwt from 'jsonwebtoken'

class StudentController {
    private _studentService: IStudentService;

    constructor(studentService: IStudentService) {
        this._studentService = studentService;
    }

    async signupPost(req: Request, res: Response): Promise<void> {
        try {
            let { username, email, password } = req.body;

            if (!username || !email || !password) {
                res
                    .status(400)
                    .json({ message: "Username, Email and Password is Required" });
                return;
            }
            const existingUser = await this._studentService.findByEmail(email);
            console.log("this is existing user", existingUser)
            if (existingUser) {
                if (existingUser.status === 0) {
                    password = await PasswordUtils.passwordHash(password);
                    await this._studentService.updateUser(email, {
                        username,
                        password,
                    } as IStudent);

                    const otp = (await OtpUtility.otpGenerator()).toString();

                    const oldOtp = await this._studentService.getOtpByEmail(email);

                    if (oldOtp) {
                        await this._studentService.storeUserResendOtp(email, otp)
                    } else {
                        await this._studentService.storeUserOtp(email, otp);
                    }


                    try {
                        await MailUtility.sendMail(email, otp, "Verification otp");

                        res.status(200).json({
                            message: "Otp sent to the mail",
                            email,
                        });
                    } catch (error) {
                        console.error("Failed to send otp", error);
                        res
                            .status(500)
                            .json({ message: "Failed to send the verification mail." });
                    }
                    return;
                }
                else {
                    res.status(409).json({ message: "User already exist." });
                    return;
                }
            }
            password = await PasswordUtils.passwordHash(password);
            await this._studentService.createUser(
                username,
                email,
                password
            );

            const otp = (await OtpUtility.otpGenerator()).toString();

            const oldOtp = await this._studentService.getOtpByEmail(email);

            if (oldOtp) {
                await this._studentService.storeUserResendOtp(email, otp)
            } else {
                await this._studentService.storeUserOtp(email, otp);
            }

            try {
                await MailUtility.sendMail(email, otp, "Verification otp");
                res.status(200).json({
                    message: "Otp sent to the given mail id",
                    email,
                    otp,
                });
            } catch (error) {
                console.error("Failed to send otp", error);
                res
                    .status(500)
                    .json({ message: "Failed to send the verification mail" });
            }
        } catch (error) {
            console.error("Error during signup:", error);
            res.status(500).json({ message: `Error while adding user: ${error}` });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const { otp, email } = req.body;
        if (!otp) {
            res.status(400).json({ message: "Otp is required" });
            return;
        }
        if (!otp || !email) {
            res.status(400).json({ message: "OTP Timeout. Try again" });
            return;
        }

        const response = await this._studentService.getOtpByEmail(email);

        const storedOtp = response?.otp;

        if (storedOtp === otp) {
            const currentUser = await this._studentService.findByEmail(email);
            if (!currentUser) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const userData: IStudent = { ...currentUser.toObject(), status: 1 };

            const updatedUser = await this._studentService.updateUser(
                email,
                userData
            );

            if (updatedUser) {
                res.status(200).json({
                    message: "Otp Verified Successfully",
                });
            } else {
                res.status(500).json({
                    message: "Error while updating user data",
                });
            }
        } else {
            res.status(400).json({
                message: "Incorrect otp Please try again later",
            });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {

        const { email } = req.body;

        const otp = (await OtpUtility.otpGenerator()).toString();
        await this._studentService.storeUserResendOtp(email, otp)

        try {
            await MailUtility.sendMail(email, otp, "Verification otp");
            res.status(200).json({
                message: "Otp sent to the given mail id",
                email,
                otp,
            });
        } catch (error) {
            console.error("Failed to send otp", error);
            res
                .status(500)
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
                    .status(400)
                    .json({
                        success: false, message: "Email and password required", data: null
                    })
            }

            const user = await this._studentService.findByEmail(email);
            console.log(user)

            if (!user) {
                res
                    .status(404)
                    .json({
                        success: false, message: "User not found Signup first to login", data: null
                    })
                return
            }
            console.log(user.status);

            if (user?.status == -1) {
                res
                    .status(403)
                    .json({
                        success: false, message: "Your Account Is Blocked By The Admin", data: null
                    });
                return;
            }

            if (!user.password) {
                res
                    .status(404)
                    .json({
                        success: false, message: "Password is not set for this account", data: null
                    })
                return
            }

            const comparePassword = await PasswordUtils.comparePassword(password, user?.password)

            if (!comparePassword) {
                res
                    .status(401)
                    .json({
                        success: false, message: "Invalid email or password", data: null,
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
                        maxAge: 24 * 60 * 60 * 1000,
                    });
                    res.cookie("accessToken", accessToken, {
                        httpOnly: false,
                        secure: true,
                        sameSite: "none",
                        maxAge: 12 * 60 * 60 * 1000,
                    });
                    res
                        .status(200)
                        .json({
                            successs: true, message: "Sign-in successful", data: { accessToken, user: filteredData }
                        });
                    return
                } else {
                    res.status(401).json({
                        success: false, message: "Invalid credentials"
                    });
                    return;
                }
            } else {
                res
                    .status(401)
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
                res.status(401).json({ success: false, message: 'Refresh token missing' });
                return
            }

            // **Verify the refresh token**
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, decoded: any) => {
                if (err) {
                    return res.status(403).json({ success: false, message: 'Invalid refresh token' });
                }

                // Generate a new access token
                const tokenInstance = new Token();
                const newAccessToken = tokenInstance.generatingTokens(decoded.userId, decoded.role).accessToken;
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    maxAge: 15 * 60 * 1000,
                });

                res.status(200).json({ success: true, accessToken: newAccessToken });
            });
        } catch (error) {
            console.error('Error refreshing token:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    };
    async logout(req: Request, res: Response): Promise<void> {

        try {
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.status(200).json({
                success: true,
                message: "Logout successful",
            });
            return
        } catch (error) {
            console.error("Logout error:", error);
            res.status(400).json({ error: "logout failed" });
            return
        }
    }

    async isBlocked(req: Request, res: Response): Promise<number | undefined> {

        try {
            let { _id } = req.body
            const response = this._studentService.isBlocked(_id);
            return response;
        } catch (error) {
            console.error('Getting status value failde', error);
            res.status(400).json({ error: "Failed to get user status" })
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            let { email } = req.body;

            if (!email) {
                res.status(400).json({ success: false, message: "Email is Required", data: null });
                return;
            }

            const user = await this._studentService.findByEmail(email);
            if (!user) {
                res.status(409).json({ success: false, message: "User not found.", data: null });
                return
            }

            if (user.status === 1) {
                const otp = (await OtpUtility.otpGenerator()).toString();
                const oldOtp = await this._studentService.getOtpByEmail(email);

                if (oldOtp) {
                    await this._studentService.storeUserResendOtp(email, otp);
                } else {
                    await this._studentService.storeUserOtp(email, otp);
                }

                try {
                    await MailUtility.sendMail(email, otp, "Verification OTP");
                    res.status(200).json({ success: true, message: "OTP sent to the given email", email });
                } catch (error) {
                    console.error("Failed to send OTP:", error);
                    res.status(500).json({ success: false, message: "Failed to send the verification mail", data: null });
                }
            } else if (user.status === -1) {
                res.status(403).json({ success: false, message: "User is blocked by the admin" });
            } else {
                res.status(403).json({ success: false, message: "User is not verified" });
            }
        } catch (error) {
            console.error("Error in forgotPassword:", error);
            res.status(500).json({success: false,message: "Internal Server Error",error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }


    async verifyForgotOtp(req: Request, res: Response): Promise<void> {
        try {
            const { otp, email } = req.body;

            if (!otp) {
                res.status(400).json({ message: "OTP is required" });
                return;
            }
            if (!email) {
                res.status(400).json({ message: "Email is required" });
                return;
            }
            const response = await this._studentService.getOtpByEmail(email);
            if (!response) {
                res.status(400).json({ message: "OTP Timeout. Try again" });
                return;
            }
            const storedOtp = response.otp;

            if (storedOtp !== otp) {
                res.status(400).json({ message: "Incorrect OTP" });
                return;
            }

            const currentUser = await this._studentService.findByEmail(email);

            if (!currentUser) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            if (currentUser.status === -1) {
                res.status(403).json({ success: false, message: "User is blocked by admin" });
                return;
            }

            if (currentUser.status === 0) {
                res.status(403).json({ success: false, message: "User is not verified" });
                return;
            }

            res.status(200).json({ success: true, message: "OTP verified successfully", email });

        } catch (error) {
            console.error("Error verifying OTP:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { password, email } = req.body;

            // Find user by email
            const user = await this._studentService.findByEmail(email);
            if (!user) {
                res.status(404).json({ success: false, message: "User not found", data: null });
                return
            }
            const hashedPassword = await PasswordUtils.passwordHash(password);
            const userData: IStudent = { ...user.toObject(), password: hashedPassword };
            const updatedUser = await this._studentService.updateUser(email, userData);

            if (updatedUser) {
                res.status(200).json({success: true,message: "Reset Password Successful",});
            } else {
                res.status(500).json({success: false,message: "Error while resetting the password",});
            }
        } catch (error) {
            console.error("Error in resetPassword:", error);
            res.status(500).json({success: false,message: "Internal Server Error",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async googleAuth(req: Request, res:Response) : Promise<void> {
        try {
            const {username,email,image} = req.body;

            console.log("Received request body:", req.body);

            if(!username || !email || ! image) {
                console.log("nothing is here    ")
                res.status(400).json({success:false,message:"credential need to login",data:null});
                return;
            }
            let user = await this._studentService.findByEmail(email);
            console.log(user)

            if(user?.status == -1){
                res.status(403).json({success:false,message:"user is blocked by the admin",data:null})
                return
            }

            if (!user) {
                const password = await PasswordUtils.passwordHash(username);
                user = await this._studentService.createUser(username, email, password);  // Assign to 'user'
            }
    
            if (!user) {
                res.status(500).json({ success: false, message: "Failed to create user", data: null });
                return;
            }

            const userData: IStudent = { ...user.toObject(), status: 1 };

            await this._studentService.updateUser(
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
                    console.log("cookie set")
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        maxAge: 24 * 60 * 60 * 1000,
                    });
                    res.cookie("accessToken", accessToken, {
                        httpOnly: false,
                        secure: true,
                        sameSite: "none",
                        maxAge: 15 * 60 * 1000,
                    });
                    res
                    .status(200)
                    .json({
                        success: true, message: "Sign-in successful", data: { accessToken, user: filteredData }
                    });
                    console.log("User signin successfull")
                    return

        }
     } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error", data: null });
    }
    }
    

}



export default StudentController;
