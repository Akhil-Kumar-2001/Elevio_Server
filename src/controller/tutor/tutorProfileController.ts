import ITutorProfileService from "../../service/tutor/ITutorProfileService";
import { Request,Response } from "express";
import { TutorType } from "../../model/tutor/tutorModel";
import { Token } from "../../utils/tokenUtility";
import jwt from 'jsonwebtoken'
import { STATUS_CODES } from "../../constants/statusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessage";

class TutorProfileController {
    private _tutorProfileService:ITutorProfileService

    constructor(tutorProfileService:ITutorProfileService){
        this._tutorProfileService = tutorProfileService
    }
    
    async getTutor(req:Request,res:Response) : Promise<void>{
        try {
            const { id } = req.params;
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ error: ERROR_MESSAGES.BAD_REQUEST });
            }
            const tutor = await this._tutorProfileService.getTutorById(id);
            if (!tutor) {
                res.status(STATUS_CODES.NOT_FOUND).json({ error: ERROR_MESSAGES.NOT_FOUND });
                return
            }
            res.status(STATUS_CODES.OK).json({success:true,message:"Tutor found ",data:tutor})
        } catch (error) {
            
        }
    }

    async verifyTutor(req:Request, res:Response) : Promise<void> {
        try {
            const { formData } = req.body;
            console.log(formData.profile.documents)
            const response = await this._tutorProfileService.verifyTutor(formData)
            if(!response){
                res.status(STATUS_CODES.NOT_FOUND).json({ error: ERROR_MESSAGES.NOT_FOUND });
                return
            }
            res.status(200).json({success:true,message:"Form submitted Successfully",data:response});

        } catch (error) {
            
        }
    }

}

export default TutorProfileController