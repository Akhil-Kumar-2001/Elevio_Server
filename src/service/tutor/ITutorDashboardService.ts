import { ITransaction } from "../../model/wallet/walletModel";
import { IDashboardDetails, MonthlyIncome, StudentsCount } from "../../Types/basicTypes";
import { TutorTransaction } from "../../Types/CategoryReturnType";

interface ITutorDashboardService {
    getMonthlyIncome(tutorId:string):Promise<MonthlyIncome[] | null>;
    getStudentsCount(tutorId:string):Promise<StudentsCount[] | null>;
    getTransactions(tutorId:string,page:number,limit:number):Promise<TutorTransaction | null>;
    getDashboradDetails(tutorId:string):Promise<IDashboardDetails | null>;
}

export default ITutorDashboardService;