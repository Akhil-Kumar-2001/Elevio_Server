import { Request, Response } from "express";
import ITutorDashboardService from "../../../service/tutor/ITutorDashboardService";
import ITutorDashboardController from "../ITutorDashboardController";
import { RDS } from "aws-sdk";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/errorMessage";

class TutorDashboardController implements ITutorDashboardController {

    private _tutorDashboardService:ITutorDashboardService;
    constructor(tutorDashboardService:ITutorDashboardService){
        this._tutorDashboardService = tutorDashboardService;
    }

    async getMonthlyIncome(req: Request, res: Response): Promise<void> {
        try {
            const tutorId = req.userId;
            const response = await this._tutorDashboardService.getMonthlyIncome(tutorId as string);
            res.status(STATUS_CODES.OK).json({success:true,message:"Monthly income retrieved successfully",data:response});
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR,data:null})
        }
    }

    async getStudentsCount(req: Request, res: Response): Promise<void> {
        try {
            const tutorId = req.userId;
            const response = await this._tutorDashboardService.getStudentsCount(tutorId as string);
            res.status(STATUS_CODES.OK).json({success:true,message:"Students count retrieved successfully",data:response});
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR,data:null})
        }
    }

    async getTransactions(req: Request, res: Response): Promise<void> {
        try {
            const tutorId = req.userId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const response = await this._tutorDashboardService.getTransactions(tutorId as string,page,limit);
            res.status(STATUS_CODES.OK).json({success:true,message:"Transaction data retrieved successfully",data:response});
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR,data:null})
        }
    }
    
    async getDashboradDetails(req: Request, res: Response): Promise<void> {
        try {
            const tutorId = req.userId;
            const response = await this._tutorDashboardService.getDashboradDetails(tutorId as string);
            res.status(STATUS_CODES.OK).json({success:true,message:"Dashboard data retrieved successfully",data:response});
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR,data:null});
        }
    }

}

export default  TutorDashboardController