import { ISessionDto } from "../../../dtos/session/sessionDto";
import { IStudentDto } from "../../../dtos/student/studentDto";
import { ISubscriptionPurchasDto } from "../../../dtos/subsription/isSubsriptionPurchasedDto";
import { mapSessionToDto } from "../../../mapper/session/sessionMapper";
import { mapStudentToDto } from "../../../mapper/student/studentMapper";
import { mapSubscriptionPurchaseToDto } from "../../../mapper/subscription/isSubsriptionPurchasedMapper";
import IStudentProfileRepository from "../../../repository/student/IStudentProfileRepository";
import { EditStudentType, SessionInfo } from "../../../Types/basicTypes";
import IStudentProfileService from "../IStudentProfileService";

class StudentProfileService implements IStudentProfileService {


    private _studentProfileRepository: IStudentProfileRepository;

    constructor(studentProfileRepository: IStudentProfileRepository) {
        this._studentProfileRepository = studentProfileRepository;
    }
    async getStudent(id: string): Promise<IStudentDto | null> {
        const student = await this._studentProfileRepository.getStudent(id);
        if (!student) return null;
        const dto = mapStudentToDto(student);
        return dto;
    }

    async getSubscriptionDetails(id: string): Promise<ISubscriptionPurchasDto | null> {
        const subscription = await this._studentProfileRepository.getSubscriptionDetails(id);
        if (!subscription) return null;
        const dto = mapSubscriptionPurchaseToDto(subscription);

        return dto;
    }

    async editProfile(id: string, formData: EditStudentType): Promise<IStudentDto | null> {
        const student = await this._studentProfileRepository.editProfile(id, formData);
        if (!student) return null;
        const dto = mapStudentToDto(student)
        return dto;
    }

    async getSessions(studentId: string): Promise<SessionInfo[] | null> {
        const response = await this._studentProfileRepository.getSessions(studentId);
        return response;
    }

    async getSessionDetails(_id: string): Promise<ISessionDto | null> {
        const response = await this._studentProfileRepository.getSessionDetails(_id);
        if(!response)return null;
        const dto = mapSessionToDto(response)
        return dto
    }

    async updateSessionStatus(_id: string, status: string): Promise<boolean | null> {
        const response = await this._studentProfileRepository.updateSessionStatus(_id, status);
        return response;
    }

}

export default StudentProfileService