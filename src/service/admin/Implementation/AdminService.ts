import { TutorType } from "../../../model/tutor/tutorModel";
import IAdminRepository from "../../../repository/admin/IAdminRepository";
import { StudentType } from "../../../model/student/studentModel"

import IAdminService from "../IAdminService";

class AdminService implements IAdminService {

    private _adminRepository: IAdminRepository;

    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository;

    }

    async getStudents(): Promise<StudentType[] | null> {
        const students = await this._adminRepository.getStudents()
        return students
    }

    async getTutors(): Promise<StudentType[] | null> {

        const tutors = await this._adminRepository.getTutors()
        return tutors

    }

    async blockTutor(id: string): Promise<TutorType | null> {
        const response = await this._adminRepository.blockTutor(id);
        return response
    }
    async blockStudent(id: string): Promise<StudentType | null> {
        const response = await this._adminRepository.blockStudent(id);
        return response
    }
}

export default AdminService;