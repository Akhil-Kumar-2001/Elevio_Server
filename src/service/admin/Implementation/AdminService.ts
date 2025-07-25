import { ITutor } from "../../../model/tutor/tutorModel";
import IAdminRepository from "../../../repository/admin/IAdminRepository";
import { IStudent } from "../../../model/student/studentModel"

import IAdminService from "../IAdminService";
import { PaginatedResponse } from "../../../Types/CategoryReturnType";
import { IStudentDto } from "../../../dtos/student/studentDto";
import { ITutorDto } from "../../../dtos/tutor/tutorDto";
import { mapStudentToDto } from "../../../mapper/student/studentMapper";
import { mapTutorToDto } from "../../../mapper/tutor/tutorMapper";

class AdminService implements IAdminService {

    private _adminRepository: IAdminRepository;

    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository;

    }

    async getStudents(page: number, limit: number): Promise<PaginatedResponse<IStudentDto> | null> {
        const students = await this._adminRepository.getStudents(page, limit)
        return students
    }

    async getTutors(page: number, limit: number): Promise<PaginatedResponse<ITutorDto> | null> {

        const tutors = await this._adminRepository.getTutors(page, limit)
        return tutors

    }

    async blockTutor(id: string): Promise<ITutorDto | null> {
        const tutor = await this._adminRepository.blockTutor(id);

        if (!tutor) return null;


        const dto = mapTutorToDto(tutor as ITutor)
        return dto
    }

    async blockStudent(id: string): Promise<IStudentDto | null> {
        const student = await this._adminRepository.blockStudent(id);

        if (!student) return null;

        const dto = mapStudentToDto(student as IStudent);
        return dto;
    }
}

export default AdminService;