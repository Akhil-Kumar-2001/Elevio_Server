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
            const { id } = req.params;
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
            const { id } = req.params;
            const subscription = await this._studentProfileService.getSubscriptionDetails(id);
            console.log("subsription details from controller",subscription)
                res.status(STATUS_CODES.OK).json({success:true,message:"Student data retrieved successfully",data:subscription});
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
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

}

export default StudentProfileController