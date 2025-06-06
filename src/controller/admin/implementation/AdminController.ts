import IAdminService from "../../../service/admin/IAdminService"
import { Request, Response } from "express";
import { Token } from "../../../utils/adminTokenUtility"
import { ERROR_MESSAGES } from "../../../constants/errorMessage";
import { STATUS_CODES } from "../../../constants/statusCode";
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import IAdminController from "../IAdminController";

dotenv.config();

class AdminController implements IAdminController {

    private _adminService: IAdminService;

    constructor(adminService: IAdminService) {
        this._adminService = adminService;
    }

    async signinPost(req: Request, res: Response): Promise<void> {

        // check email and password valid
        // check existing user or not if not tell to signup
        // if it is existing user check the user is blocked or not
        // then compare the password
        // if password correct create access and refresh token
        // store those token in cookie

        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.BAD_REQUEST, data: null })
            }

            if (process.env.ADMIN_MAIL == email && process.env.ADMIN_PASSWORD) {
                const tokenInstance = new Token();
                const { accessToken, refreshToken } = tokenInstance.generatingTokens(email);
                console.log("Accesstoken : ", accessToken)
                console.log("Refreshtoken : ", refreshToken)
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
                    res.status(STATUS_CODES.OK).json({ successs: true, message: "Sign-in successful", data: { accessToken, user: { id: email, role: "admin" } } });
                    return
                }
            } else {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED, data: null })
            }

        } catch (error) {
            console.error("Error during signup:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies['admin-refreshToken'];
            if (!refreshToken) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, message: 'Refresh token missing' });
                return
            }

            // **Verify the refresh token**
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: unknown, decoded: JwtPayload | string | undefined) => {
                if (err) {
                    return res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: 'Invalid refresh token' });
                }
                // Generate a new access token
                const { role, id } = decoded as { role: string, id: string }

                const tokenInstance = new Token();
                const newAccessToken = tokenInstance.generatingTokens(id, role).accessToken;
                console.log("new access token", newAccessToken)
                res.cookie("admin-accessToken", newAccessToken, {
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
            res.clearCookie("admin-accessToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: ".elevic.site",
                path: "/"
            });
            res.clearCookie("admin-refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: ".elevic.site",
                path: "/"
            });
            res.status(STATUS_CODES.OK).json({ success: true, message: "Logout successful", });
            return
        } catch (error) {
            console.error("Logout error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({ error: "logout failed" });
            return
        }
    }

    async getStudents(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const students = await this._adminService.getStudents(page, limit)
            res.status(STATUS_CODES.OK).json({ success: true, message: "Student data Retrived", data: students })
        } catch (error) {
            console.error("Error while retriving Student data.", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Student data Retrived failed", data: null });
            return
        }
    }

    async getTutors(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const tutors = await this._adminService.getTutors(page, limit)
            res.status(STATUS_CODES.OK).json({ success: true, message: "Student data Retrived", data: tutors })
        } catch (error) {
            console.error("Error while retriving Tutors data.", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Tutors data Retrived failed", data: null });
            return;
        }
    }

    async blockTutor(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body
            const response = await this._adminService.blockTutor(id);
            console.log(response)
            if (response) res.status(STATUS_CODES.OK).json({ success: true, message: "Change status success", data: response })
        } catch (error) {
            console.log(error)
        }
    }

    async blockStudent(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body
            const response = await this._adminService.blockStudent(id);
            console.log(response)
            if (response) res.status(STATUS_CODES.OK).json({ success: true, message: "Change status success", data: response })
        } catch (error) {
            console.log(error)
        }
    }

}

export default AdminController