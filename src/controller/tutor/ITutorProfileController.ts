import { Request,Response } from "express"

interface ITutorProfileController{
    getTutor(req:Request,res:Response):Promise<void>;
    verifyTutor(req:Request,res:Response):Promise<void>;
    updateProfile(req:Request,res:Response):Promise<void>;
    createSession(req:Request,res:Response):Promise<void>;
    getSessions(req:Request,res:Response):Promise<void>;
    getSessionDetails(req:Request,res:Response):Promise<void>;
    updateSessionStatus(req:Request,res:Response):Promise<void>

}

export default ITutorProfileController