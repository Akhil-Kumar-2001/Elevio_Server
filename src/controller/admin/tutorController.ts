import { ERROR_MESSAGES } from '../../constants/errorMessage';
import { STATUS_CODES } from '../../constants/statusCode';
import IAdminTutorService from "../../service/admin/IAdminTutorService";
import { Request, Response } from "express"; //



class AdminTutorController {

    private _adminTutorService: IAdminTutorService;

    constructor(adminTutorService: IAdminTutorService) {
        this._adminTutorService = adminTutorService;
    }

    async getPendingTutors(req:Request, res:Response): Promise<void> {
        try {
            const tutors = await this._adminTutorService.getPendingTutors()
            console.log("Pending tutors",tutors)
            res.status(STATUS_CODES.OK).json({success:true,message:"Pending tutors Retrived",data:tutors})
        } catch (error) {
            console.error("Error while retriving Tutors data.", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({ success:false,message:"Tutors data Retrived failed",data:null });
            return;
        }
    }

    async getTutor(req:Request,res:Response) : Promise<void>{
        try {
            const { id } = req.params;
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ error: ERROR_MESSAGES.BAD_REQUEST });
            }
            const tutor = await this._adminTutorService.getTutorById(id);
            if (!tutor) {
                res.status(STATUS_CODES.NOT_FOUND).json({ error: ERROR_MESSAGES.NOT_FOUND });
                return
            }
            res.status(STATUS_CODES.OK).json({success:true,message:"Tutor found ",data:tutor})
        } catch (error) {
            
        }
    }

    async rejectTutor(req:Request,res:Response) : Promise<void>{
        try {
            const {id}= req.body;
            const response = await this._adminTutorService.rejectTutor(id)
            if(!response){
                res.status(STATUS_CODES.NOT_FOUND).json({success:false,message:ERROR_MESSAGES.NOT_FOUND,data:null})
                return
            }
            res.status(STATUS_CODES.OK).json({success:true,message:"Tutor rejected successfully",data:response})
        } catch (error) {
            
        }
    }

    async approveTutor(req:Request,res:Response) : Promise<void>{
        try {
            const {id}= req.body;
            const response = await this._adminTutorService.approveTutor(id)
            if(!response){
                res.status(STATUS_CODES.NOT_FOUND).json({success:false,message:ERROR_MESSAGES.NOT_FOUND,data:null})
                return
            }
            res.status(STATUS_CODES.OK).json({success:true,message:"Tutor approved successfully",data:response})
        } catch (error) {
            
        }
    }
}



export default AdminTutorController