import { ITutor } from "../../../model/tutor/tutorModel";
import IAdminRepository from "../../../repository/admin/IAdminRepository";
import { IStudent } from "../../../model/student/studentModel"

import IAdminService from "../IAdminService";

class AdminService implements IAdminService {

    private _adminRepository: IAdminRepository;

    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository;

    }

    async getStudents(): Promise<IStudent[] | null> {
        const students = await this._adminRepository.getStudents()
        return students
    }

    async getTutors(): Promise<IStudent[] | null> {

        const tutors = await this._adminRepository.getTutors()
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