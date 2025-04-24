import { IAdminWallet } from "../../model/adminwallet/adminwallet"
import { IStudent } from "../../model/student/studentModel"
import { CategoryIncome, DashboardData, MonthlyIncome, YearlyIncome } from "../../Types/basicTypes"

interface IAdminDashboardRepository {
    getDashboardData(): Promise<DashboardData | null>
    getWallet(page:number,limit:number): Promise<IAdminWallet | null>
    getStudents(): Promise<IStudent[] | null>
    getCategoryIncomeDistribution(): Promise<CategoryIncome[] | null>
    getAdminMonthlyIncome(year:number):Promise<MonthlyIncome[] | null>
    getAdminYearlyIncome(year:number):Promise<YearlyIncome[] | null>
}

export default IAdminDashboardRepository