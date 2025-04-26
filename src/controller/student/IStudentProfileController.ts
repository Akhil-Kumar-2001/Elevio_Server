import { Request, Response } from "express";


interface IStudentProfileController {
    getStudent(req:Request,res:Response):Promise<void>
    getSubscriptionDetails(req:Request,res:Response):Promise<void>
    editProfile(req:Request,res:Response):Promise<void>
    getSessions(req:Request,res:Response):Promise<void>
    getSessionDetails(req:Request,res:Response):Promise<void>
    updateSessionStatus(req:Request,res:Response):Promise<void>
}

export default  IStudentProfileController