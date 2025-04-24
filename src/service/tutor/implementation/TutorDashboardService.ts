import { ITransaction } from "../../../model/wallet/walletModel";
import ITutorDashboardRepository from "../../../repository/tutor/ITutorDashboardRepository";
import { IDashboardDetails, MonthlyIncome, StudentsCount, YearlyIncome } from "../../../Types/basicTypes";
import { TutorTransaction } from "../../../Types/CategoryReturnType";
import ITutorDashboardService from "../ITutorDashboardService";

class TutorDashboardService implements ITutorDashboardService {

    private _tutorDashboardRepository:ITutorDashboardRepository;
    constructor(tutorDashboardRepository:ITutorDashboardRepository){
        this._tutorDashboardRepository = tutorDashboardRepository;
    }

    async getMonthlyIncome(tutorId: string): Promise<MonthlyIncome[] | null> {
        const response = await this._tutorDashboardRepository.getMonthlyIncome(tutorId);
        return response;
    }

    async getYearlyIncome(tutorId: string): Promise<YearlyIncome[] | null> {
        const response = await this._tutorDashboardRepository.getYearlyIncome(tutorId);
        return response;
    }

    async getStudentsCount(tutorId: string): Promise<StudentsCount[] | null> {
        const response = await this._tutorDashboardRepository.getStudentsCount(tutorId);
        return response;
    }

    async getTransactions(tutorId: string,page:number,limit:number): Promise<TutorTransaction | null> {
        const response = await this._tutorDashboardRepository.getTransactions(tutorId,page,limit);
        return response;
    }

    async getDashboradDetails(tutorId: string): Promise<IDashboardDetails | null> {
        const response = await this._tutorDashboardRepository.getDashboradDetails(tutorId);
        return response;
    }
}

export default TutorDashboardService;