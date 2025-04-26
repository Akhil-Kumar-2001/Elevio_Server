import { Request, response, Response } from "express";
import IStudentProfileService from "../../../service/student/IStudentProfileService";
import IStudentProfileController from "../IStudentProfileController";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/errorMessage";

class StudentProfileController implements IStudentProfileController {
    private _studentProfileService: IStudentProfileService;

    constructor(studentService: IStudentProfileService) {
        this._studentProfileService = studentService;
    }

    async getStudent(req: Request, res: Response): Promise<void> {
        try {
            const id = req.userId as string;
            const student = await this._studentProfileService.getStudent(id)
            if (student) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Student data retrieved successfull", data: student })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while getting student details" });
        }
    }


    async getSubscriptionDetails(req: Request, res: Response): Promise<void> {
        try {
            // const { id } = req.params;
            const id = req.userId as string
            const subscription = await this._studentProfileService.getSubscriptionDetails(id);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Student data retrieved successfully", data: subscription });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR })
        }
    }

    async editProfile(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const { formData } = req.body
            const response = await this._studentProfileService.editProfile(id, formData)
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Student Profile edited successfully", data: response })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while editing student profile" });

        }
    }


    async getSessions(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.userId;
            const response = await this._studentProfileService.getSessions(studentId as string);
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
            const response = await this._studentProfileService.getSessionDetails(id);
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
            const response = await this._studentProfileService.updateSessionStatus(id, status);
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Session details retrieved Successfully", data: response })
            }
        } catch (error) {
            console.log("Error while fetching session details :", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

}

export default StudentProfileController