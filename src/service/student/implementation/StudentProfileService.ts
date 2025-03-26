import { IStudent } from "../../../model/student/studentModel";
import IStudentProfileRepository from "../../../repository/student/IStudentProfileRepository";
import { EditStudentType } from "../../../Types/basicTypes";

class StudentProfileService {


    private _studentProfileRepository: IStudentProfileRepository;

    constructor(studentProfileRepository: IStudentProfileRepository) {
        this._studentProfileRepository = studentProfileRepository;
    }
    async getStudent(id: string): Promise<IStudent | null> {
        const student = await this._studentProfileRepository.getStudent(id);
        return student;
    }

    async editProfile(id: string, formData: EditStudentType): Promise<IStudent | null> {
        const student = await this._studentProfileRepository.editProfile(id, formData);
        return student
    }
}

export default StudentProfileService