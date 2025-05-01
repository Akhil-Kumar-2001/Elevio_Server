import { Request, Response } from "express"

interface ITutorDashboardController{
    getMonthlyIncome(req:Request,res:Response):Promise<void>;
    getStudentsCount(req:Request,res:Response):Promise<void>;
    getTransactions(req:Request,res:Response):Promise<void>;
    getDashboradDetails(req:Request,res:Response):Promise<void>;
    getYearlyIncome(req:Request,res:Response):Promise<void>;
    getIncomeByDateRange(req:Request,res:Response):Promise<void>;

}

export default ITutorDashboardController