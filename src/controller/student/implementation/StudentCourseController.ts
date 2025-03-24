import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../constants/errorMessage";
import { STATUS_CODES } from "../../../constants/statusCode";
import IStudentCourseService from "../../../service/student/IStudentCourseService";
import IStudentCourseController from "../IStudentCourseController";

class StudentCourseController implements IStudentCourseController{

        private _studentCourseService: IStudentCourseService;

        constructor(studentCourseService: IStudentCourseService) {
            this._studentCourseService = studentCourseService;
        }

        async getListedCourse(req: Request, res: Response): Promise<void> {
                            try {
                const response = await this._studentCourseService.getListedCourse();
                if(response){
                    res.status(STATUS_CODES.OK).json({success:true,message:"Listed course Retrieved successfully",data:response})
                }
            } catch (error) {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
    
            }
        }

        // async getListedCourse(req: Request, res: Response): Promise<void> {
                
        //     try {
        //         const response = await this._studentCourseService.getListedCourse();
        //         if(response){
        //             res.status(STATUS_CODES.OK).json({success:true,message:"Listed course Retrieved successfully",data:response})
        //         }
        //     } catch (error) {
        //         res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
    
        //     }
        // }
}

export default StudentCourseController