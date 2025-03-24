import { Request, Response } from "express";

interface IAdminTutorController {
    getPendingTutors(req:Request,res:Response):Promise<void>
    getTutor(req:Request,res:Response):Promise<void>
    rejectTutor(req:Request,res:Response):Promise<void>
    approveTutor(req:Request,res:Response):Promise<void>
    createCategory(req:Request,res:Response):Promise<void>
    getCategories(req:Request,res:Response):Promise<void>
    blockCategory(req:Request,res:Response):Promise<void>
    deleteCategory(req:Request,res:Response):Promise<void>
    pendingCourse(req:Request,res:Response):Promise<void>
    getCategory(req:Request,res:Response):Promise<void>
    courseDetails(req:Request,res:Response):Promise<void>
    getSections(req:Request,res:Response):Promise<void>
    getLectures(req:Request,res:Response):Promise<void>
    rejectCourse(req:Request,res:Response):Promise<void>
    approveCourse(req:Request,res:Response):Promise<void>

}

export default IAdminTutorController;
