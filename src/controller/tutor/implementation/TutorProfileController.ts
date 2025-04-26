import ITutorProfileService from "../../../service/tutor/ITutorProfileService";
import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/errorMessage";
import ITutorProfileController from "../ITutorProfileController";

class TutorProfileController implements ITutorProfileController {
    private _tutorProfileService: ITutorProfileService

    constructor(tutorProfileService: ITutorProfileService) {
        this._tutorProfileService = tutorProfileService
    }

    async getTutor(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ error: ERROR_MESSAGES.BAD_REQUEST });
            }
            const tutor = await this._tutorProfileService.getTutorById(id);
            if (!tutor) {
                res.status(STATUS_CODES.NOT_FOUND).json({ error: ERROR_MESSAGES.NOT_FOUND });
                return
            }
            res.status(STATUS_CODES.OK).json({ success: true, message: "Tutor found ", data: tutor })
        } catch (error) {
            console.error("Error fetching tutor:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async verifyTutor(req: Request, res: Response): Promise<void> {
        try {
            const { formData } = req.body;
            console.log(formData.profile.documents)
            const response = await this._tutorProfileService.verifyTutor(formData)
            if (!response) {
                res.status(STATUS_CODES.NOT_FOUND).json({ error: ERROR_MESSAGES.NOT_FOUND });
                return
            }
            res.status(200).json({ success: true, message: "Form submitted Successfully", data: response });

        } catch (error) {
            console.log("Error verifying tutor:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const { id, formData } = req.body;
            const response = await this._tutorProfileService.updateProfile(id, formData);
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Profile updated Successfully", data: response })
            }
        } catch (error) {
            console.log("Error updating profile:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async createSession(req: Request, res: Response): Promise<void> {
        try {
            const { sessionData } = req.body
            console.log("session data from frontend", sessionData)
            const sessionExist = await this._tutorProfileService.sessionExist(sessionData);
            console.log("exist sessions", sessionExist)
            if (sessionExist) {
                res.status(STATUS_CODES.CONFLICT).json({ success: false, message: "Already hava a session in this time period", data: null });
                return;
            }
            const response = await this._tutorProfileService.createSession(sessionData);
            res.status(STATUS_CODES.CREATED).json({ success: true, message: "Session scheduled successfully", data: response });
        } catch (error) {
            console.log("Error creating session:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async getSessions(req: Request, res: Response): Promise<void> {
        try {
            const tutorId = req.userId;
            const response = await this._tutorProfileService.getSessions(tutorId as string);
            console.log("retrived session sorted", response)
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Scheduled session retrieved Successfully", data: response })
            }
        } catch (error) {
            console.log("Error while fetching session data :", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async getSessionDetails(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this._tutorProfileService.getSessionDetails(id);
            console.log("retrived session details", response)
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Session details retrieved Successfully", data: response })
            }
        } catch (error) {
            console.log("Error while fetching session details :", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async updateSessionStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const response = await this._tutorProfileService.updateSessionStatus(id, status);
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Session details retrieved Successfully", data: response })
            }
        } catch (error) {
            console.log("Error while fetching session details :", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }


}

export default TutorProfileController