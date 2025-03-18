import { ERROR_MESSAGES } from "../../constants/errorMessage";
import { STATUS_CODES } from "../../constants/statusCode";
import { Request, Response } from "express";
import ITutorCourseService from "../../service/tutor/ITutorCourseService"


class TutorCourseController {
    private _tutorCourseService: ITutorCourseService

    constructor(tutorCourseService: ITutorCourseService) {
        this._tutorCourseService = tutorCourseService
    }

    async getCategories(req:Request,res:Response):Promise<void> {
            try {
                const response = await this._tutorCourseService.getCategories()
                if(response){
                    res.status(STATUS_CODES.OK).json({success:true,message:"Categories retrieved Successfully",data:response})
                }
            } catch (error) {
                console.log("Error while retrieving categories:", error);
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        }

    async createCourse(req: Request, res: Response): Promise<void> {
        try {
            const courseData = req.body;
            console.log("Course data form controller", courseData)
            const response = await this._tutorCourseService.createCourse(courseData);
            console.log("Course creation response after response",response)
            if (response) {
                res.status(STATUS_CODES.CREATED).json({ success: true, message: "Course created Successfully", data: response })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }
}

export default TutorCourseController