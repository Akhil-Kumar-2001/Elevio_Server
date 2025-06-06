import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../constants/errorMessage";
import { STATUS_CODES } from "../../../constants/statusCode";
import IAdminDashboardService from "../../../service/admin/IAdminDashboardService";
import IAdminDashboardController from "../IAdminDashboardController";

class AdminDashboardController implements IAdminDashboardController {
    private _adminDashboardService: IAdminDashboardService
    constructor(adminDashboardService: IAdminDashboardService) {
        this._adminDashboardService = adminDashboardService;
    }

    async getDashboardData(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._adminDashboardService.getDashboardData();
            res.status(STATUS_CODES.OK).json({ success: true, message: "Dashboard data retrieved successfully", data: response })
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getWallet(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const response = await this._adminDashboardService.getWallet(page,limit);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Admin wallet retrieved successfully", data: response });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getStudents(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._adminDashboardService.getStudents();
            res.status(STATUS_CODES.OK).json({ success: true, message: "students data retrieved successfully", data: response });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }
    
    async getCategoryIncomeDistribution(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._adminDashboardService.getCategoryIncomeDistribution();
            res.status(STATUS_CODES.OK).json({success:true,message:"Category wise income retrived successfully",data:response})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
        }
    }
    
    async getAdminMonthlyIncome(req: Request, res: Response): Promise<void> {
        try {
            const currentYear = new Date().getFullYear();
            const response = await this._adminDashboardService.getAdminMonthlyIncome(currentYear);
            res.status(STATUS_CODES.OK).json({success:true,message:"Admin monthly income retrived successfully",data:response})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
        }
    }

    async getAdminYearlyIncome(req: Request, res: Response): Promise<void> {
        try {
            const currentYear = new Date().getFullYear();
            const response = await this._adminDashboardService.getAdminYearlyIncome(currentYear);
            res.status(STATUS_CODES.OK).json({success:true,message:"Admin yearly income retrived successfully",data:response})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
        }
    }

    async getAdminIncomeByDateRange(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Start date and end date are required", data: null });
                return;
            }
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);
            const response = await this._adminDashboardService.getAdminIncomeByDateRange(start.toISOString(), end.toISOString());
            res.status(STATUS_CODES.OK).json({success:true,message:"Admin income by date range retrived successfully",data:response})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
        }
    }
}

export default AdminDashboardController;