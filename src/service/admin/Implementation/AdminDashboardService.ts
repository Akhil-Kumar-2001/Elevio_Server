import { IAdminWallet } from "../../../model/adminwallet/adminwallet";
import { IStudent } from "../../../model/student/studentModel";
import IAdminDashboardRepository from "../../../repository/admin/IAdminDashboardRepository";
import { CategoryIncome, DashboardData, MonthlyIncome, YearlyIncome } from "../../../Types/basicTypes";
import IAdminDashboardService from "../IAdminDashboardService";

class AdminDashboardService implements IAdminDashboardService {
    private _adminDashboardRepository: IAdminDashboardRepository;
    constructor(adminDashboardRepository: IAdminDashboardRepository) {
        this._adminDashboardRepository = adminDashboardRepository;
    }

    async getDashboardData(): Promise<DashboardData | null> {
        const response = await this._adminDashboardRepository.getDashboardData();
        return response;
    }

    async getWallet(page:number,limit:number): Promise<IAdminWallet | null> {
        const response = await this._adminDashboardRepository.getWallet(page,limit);
        return response;
    }

    async getStudents(): Promise<IStudent[] | null> {
        const response = await this._adminDashboardRepository.getStudents();
        return response;
    }

    async getCategoryIncomeDistribution(): Promise<CategoryIncome[] | null> {
        const response = await this._adminDashboardRepository.getCategoryIncomeDistribution();
        return response
    }

    async getAdminMonthlyIncome(year: number): Promise<MonthlyIncome[] | null> {
        const response = await this._adminDashboardRepository.getAdminMonthlyIncome(year);
        return response
    }

    async getAdminYearlyIncome(year: number): Promise<YearlyIncome[] | null> {
        const response = await this._adminDashboardRepository.getAdminYearlyIncome(year);
        return response
    }

    async getAdminIncomeByDateRange(startDate: string, endDate: string): Promise<MonthlyIncome[] | null> {
        const response = await this._adminDashboardRepository.getAdminIncomeByDateRange(startDate, endDate);
        return response
    }
}

export default AdminDashboardService;