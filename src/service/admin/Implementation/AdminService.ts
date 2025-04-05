import { ITutor } from "../../../model/tutor/tutorModel";
import IAdminRepository from "../../../repository/admin/IAdminRepository";
import { IStudent } from "../../../model/student/studentModel"

import IAdminService from "../IAdminService";
import { StudentResponseDataType, TutorResponseDataType } from "../../../Types/CategoryReturnType";

class AdminService implements IAdminService {

    private _adminRepository: IAdminRepository;

    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository;

    }

    async getStudents(page:number,limit:number): Promise<StudentResponseDataType | null> {
        const students = await this._adminRepository.getStudents(page,limit)
        return students
    }

    async getTutors(page:number,limit:number): Promise<TutorResponseDataType | null> {

        const tutors = await this._adminRepository.getTutors(page,limit)
        return tutors

    }

    async blockTutor(id: string): Promise<ITutor | null> {
        const response = await this._adminRepository.blockTutor(id);
        return response
    }
    async blockStudent(id: string): Promise<IStudent | null> {
        const response = await this._adminRepository.blockStudent(id);
        return response
    }
}

export default AdminService;