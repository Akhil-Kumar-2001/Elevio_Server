import { ICategoryIncomeDto, IDashboardDataDto, IMonthlyIncomeDto, IYearlyIncomeDto } from "../../../dtos/dashboard/dashboardDataDto";
import { IStudentDto } from "../../../dtos/student/studentDto";
import { IAdminWalletdto } from "../../../dtos/wallet/adminwallet/adminWalletDto";
import { mapStudentsToDto } from "../../../mapper/student/studentMapper";
import { mapAdminWalletToDto } from "../../../mapper/wallet/adminwallet/adminWalletMapper";
import { IAdminWallet } from "../../../model/adminwallet/adminwallet";
import { IStudent } from "../../../model/student/studentModel";
import IAdminDashboardRepository from "../../../repository/admin/IAdminDashboardRepository";
import IAdminDashboardService from "../IAdminDashboardService";

class AdminDashboardService implements IAdminDashboardService {
    private _adminDashboardRepository: IAdminDashboardRepository;
    constructor(adminDashboardRepository: IAdminDashboardRepository) {
        this._adminDashboardRepository = adminDashboardRepository;
    }

    async getDashboardData(): Promise<IDashboardDataDto | null> {
        const response = await this._adminDashboardRepository.getDashboardData();
        return response;
    }

    async getWallet(page:number,limit:number): Promise<IAdminWalletdto | null> {
        const response = await this._adminDashboardRepository.getWallet(page,limit);
        const dto = mapAdminWalletToDto(response as IAdminWallet)
        return dto;
    }

    async getStudents(): Promise<IStudentDto[] | null> {
        const response = await this._adminDashboardRepository.getStudents();
        const dto = mapStudentsToDto(response as IStudent[]);
        return dto;
    }

    async getCategoryIncomeDistribution(): Promise<ICategoryIncomeDto[] | null> {
        const response = await this._adminDashboardRepository.getCategoryIncomeDistribution();
        return response
    }

    async getAdminMonthlyIncome(year: number): Promise<IMonthlyIncomeDto[] | null> {
        const response = await this._adminDashboardRepository.getAdminMonthlyIncome(year);
        return response
    }

    async getAdminYearlyIncome(year: number): Promise<IYearlyIncomeDto[] | null> {
        const response = await this._adminDashboardRepository.getAdminYearlyIncome(year);
        return response
    }

    async getAdminIncomeByDateRange(startDate: string, endDate: string): Promise<IMonthlyIncomeDto[] | null> {
        const response = await this._adminDashboardRepository.getAdminIncomeByDateRange(startDate, endDate);
        return response
    }
}

export default AdminDashboardService;