import { Request, Response } from "express"

interface IAdminController{
    signinPost(req:Request,res:Response):Promise<void>
    refreshToken(req:Request,res:Response):Promise<void>
    logout(req:Request,res:Response):Promise<void>
    getStudents(req:Request,res:Response):Promise<void>
    getTutors(req:Request,res:Response):Promise<void>
    blockTutor(req:Request,res:Response):Promise<void>
    blockStudent(req:Request,res:Response):Promise<void>
}

export default IAdminController