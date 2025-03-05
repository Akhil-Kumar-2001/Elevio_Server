import { Student,StudentType } from "../../../model/student/studentModel";
import { Tutor, TutorType } from "../../../model/tutor/tutorModel";
import IAdminRepository from "../IAdminRepository";

class AdminRepository implements IAdminRepository {

    async getStudents(): Promise<StudentType[] | null> {
        return await Student.find({}, { _id: 1, username: 1, email: 1, status: 1, role: 1, createdAt: 1 });
    }

    async getTutors(): Promise<StudentType[] | null> {
        return await Tutor.find({}, { _id: 1, username: 1, email: 1, status: 1, role: 1, createdAt: 1 });
    }

    async blockTutor(id: string): Promise<TutorType | null> {
            const tutor = await Tutor.findById(id,{status:1})
            const newStatus = tutor?.status === 1 ?-1 : 1
            const updatedTutor = await Tutor.findByIdAndUpdate(
                id,
                { status: newStatus },
                { new: true } // Returns the updated document
            );
            return updatedTutor
    }
    async blockStudent(id: string): Promise<StudentType | null> {
            const student = await Student.findById(id,{status:1})
            const newStatus = student?.status === 1 ?-1 : 1
            const updatedStudent = await Student.findByIdAndUpdate(
                id,
                { status: newStatus },
                { new: true } // Returns the updated document
            );
            return updatedStudent
    }
    
}

export default AdminRepository