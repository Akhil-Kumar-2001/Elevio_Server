import { ERROR_MESSAGES } from "../../constants/errorMessage";
import { STATUS_CODES } from "../../constants/statusCode";
import { Request, Response } from "express";
import ITutorCourseService from "../../service/tutor/ITutorCourseService"


class TutorCourseController {
    private _tutorCourseService: ITutorCourseService

    constructor(tutorCourseService: ITutorCourseService) {
        this._tutorCourseService = tutorCourseService
    }

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._tutorCourseService.getCategories()
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Categories retrieved Successfully", data: response })
            }
        } catch (error) {
            console.log("Error while retrieving categories:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async createCourse(req: Request, res: Response): Promise<void> {
        try {
            const courseData = req.body;
            const response = await this._tutorCourseService.createCourse(courseData);
            if (response) {
                res.status(STATUS_CODES.CREATED).json({ success: true, message: "Course created Successfully", data: response })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getCourses(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;

            const response = await this._tutorCourseService.getCourses(page,limit);
            res.status(STATUS_CODES.OK).json({success:true,message:"Courses retrieved successfully",data:response})
        } catch (error) {
            console.log("Error fetching courses", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error fetching Courses" });
        }
    }

    async getCourseDetails(req:Request,res:Response):Promise<void> {
        try {
            const id = (req.query.id as string);
            const response = await this._tutorCourseService.getCourseDetails(id);
            res.status(STATUS_CODES.OK).json({success:true,message:"Course details retrieved successfully",data:response})
        } catch (error) {
            console.log("Error fetching courses", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error fetching Course details" }); 
        }
    }

    async editCourse(req:Request,res:Response):Promise<void> {
        try {
            const {id,editedCourse} = req.body;
            const response = this._tutorCourseService.editCourse(id,editedCourse);
            res.status(STATUS_CODES.OK).json({success:true,message:"Course details updated successfully",data:response})
        } catch (error) {
            console.log("Error editing course details", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error editing Course details" }); 
        }
    }
}

export default TutorCourseController