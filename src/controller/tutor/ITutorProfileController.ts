import { Request,Response } from "express"

interface ITutorProfileController{
    getTutor(req:Request,res:Response):Promise<void>;
    verifyTutor(req:Request,res:Response):Promise<void>;
    updateProfile(req:Request,res:Response):Promise<void>;

}

export default ITutorProfileController