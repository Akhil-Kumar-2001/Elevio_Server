import { IStudent } from "../../../model/student/studentModel";
import { ISubscriptionPurchased } from "../../../model/subscription/SubscriptionPurchased";
import IStudentProfileRepository from "../../../repository/student/IStudentProfileRepository";
import { EditStudentType, SessionInfo } from "../../../Types/basicTypes";
import IStudentProfileService from "../IStudentProfileService";

class StudentProfileService implements IStudentProfileService {


    private _studentProfileRepository: IStudentProfileRepository;

    constructor(studentProfileRepository: IStudentProfileRepository) {
        this._studentProfileRepository = studentProfileRepository;
    }
    async getStudent(id: string): Promise<IStudent | null> {
        const student = await this._studentProfileRepository.getStudent(id);
        return student;
    }

    async getSubscriptionDetails(id: string): Promise<ISubscriptionPurchased | null> {
        const subscription = await this._studentProfileRepository.getSubscriptionDetails(id);
        return subscription;
    }

    async editProfile(id: string, formData: EditStudentType): Promise<IStudent | null> {
        const student = await this._studentProfileRepository.editProfile(id, formData);
        return student
    }

    async getSessions(studentId: string): Promise<SessionInfo[] | null> {
        const response = await this._studentProfileRepository.getSessions(studentId);
        return response;
    }
}

export default StudentProfileService