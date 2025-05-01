import { ITransaction } from "../../model/wallet/walletModel";
import { IDashboardDetails, MonthlyIncome, StudentsCount, YearlyIncome } from "../../Types/basicTypes";
import { TutorTransaction } from "../../Types/CategoryReturnType";

interface ITutorDashboardService {
    getMonthlyIncome(tutorId:string):Promise<MonthlyIncome[] | null>;
    getYearlyIncome(tutorId:string):Promise<YearlyIncome[] | null>;
    getStudentsCount(tutorId:string):Promise<StudentsCount[] | null>;
    getTransactions(tutorId:string,page:number,limit:number):Promise<TutorTransaction | null>;
    getDashboradDetails(tutorId:string):Promise<IDashboardDetails | null>;
    getIncomeByDateRange(tutorId:string,startDate:Date,endDate:Date):Promise<MonthlyIncome[] | null>;
}

export default ITutorDashboardService;