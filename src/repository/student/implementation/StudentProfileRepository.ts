import { IStudent, Student } from "../../../model/student/studentModel";
import { EditStudentType } from "../../../Types/basicTypes";

class StudentProfileRepository{
    async getStudent(id: string): Promise<IStudent | null> {
        const student = await Student.findOne({_id:id});
        return student;
    }

    async editProfile(id: string, formData: EditStudentType): Promise<IStudent | null> {
        const updatedStudent = await Student.findByIdAndUpdate(
            id, 
            { $set: formData }, 
            { new: true } 
        );
        return updatedStudent ? updatedStudent : null;
    }
}

export default  StudentProfileRepository