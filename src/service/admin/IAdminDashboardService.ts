import { ICategoryIncomeDto, IDashboardDataDto, IMonthlyIncomeDto, IYearlyIncomeDto } from "../../dtos/dashboard/dashboardDataDto";
import { IStudentDto } from "../../dtos/student/studentDto";
import { IAdminWalletdto } from "../../dtos/wallet/adminwallet/adminWalletDto";

interface IAdminDashboardService {
    getDashboardData(): Promise<IDashboardDataDto | null>;
    getWallet(page: number, limit: number): Promise<IAdminWalletdto | null>;
    getStudents(): Promise<IStudentDto[] | null>;
    getCategoryIncomeDistribution(): Promise<ICategoryIncomeDto[] | null>
    getAdminMonthlyIncome(year:number): Promise<IMonthlyIncomeDto[] | null>
    getAdminYearlyIncome(year:number): Promise<IYearlyIncomeDto[] | null>
    getAdminIncomeByDateRange(startDate: string, endDate: string): Promise<IMonthlyIncomeDto[] | null>

}

export default IAdminDashboardService