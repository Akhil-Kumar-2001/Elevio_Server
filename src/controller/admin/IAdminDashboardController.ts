import { Request, Response } from "express";


interface IAdminDashboardController {
    getDashboardData(req: Request, res: Response): Promise<void>
    getWallet(req: Request, res: Response): Promise<void>
    getStudents(req: Request, res: Response): Promise<void>
    getCategoryIncomeDistribution(req: Request, res: Response): Promise<void>
    getAdminMonthlyIncome(req: Request, res: Response): Promise<void>
    getAdminYearlyIncome(req: Request, res: Response): Promise<void>
    getAdminIncomeByDateRange(req: Request, res: Response): Promise<void>
}

export default IAdminDashboardController;