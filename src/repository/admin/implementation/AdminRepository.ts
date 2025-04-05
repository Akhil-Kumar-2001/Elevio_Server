import { Student, IStudent } from "../../../model/student/studentModel";
import { Tutor, ITutor } from "../../../model/tutor/tutorModel";
import { StudentResponseDataType, TutorResponseDataType } from "../../../Types/CategoryReturnType";
import IAdminRepository from "../IAdminRepository";

class AdminRepository implements IAdminRepository {

    async getStudents(page: number, limit: number): Promise<StudentResponseDataType | null> {
        const skip = (page - 1) * limit;
        const students = await Student.find({}, { _id: 1, username: 1, email: 1, status: 1, role: 1, createdAt: 1 })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

            const totalRecord = await Student.countDocuments()
            return { students, totalRecord }
    }

    async getTutors(page: number, limit: number): Promise<TutorResponseDataType | null> {
        const skip = (page - 1) * limit;
        const tutors = await Tutor.find({}, { _id: 1, username: 1, email: 1, status: 1, role: 1, createdAt: 1 })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        const totalRecord = await Tutor.countDocuments()
        return { tutors, totalRecord }
    }

    async blockTutor(id: string): Promise<ITutor | null> {
        const tutor = await Tutor.findById(id, { status: 1 })
        const newStatus = tutor?.status === 1 ? -1 : 1
        const updatedTutor = await Tutor.findByIdAndUpdate(
            id,
            { status: newStatus },
            { new: true } // Returns the updated document
        );
        return updatedTutor
    }
    async blockStudent(id: string): Promise<IStudent | null> {
        const student = await Student.findById(id, { status: 1 })
        const newStatus = student?.status === 1 ? -1 : 1
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { status: newStatus },
            { new: true } // Returns the updated document
        );
        return updatedStudent
    }

}

export default AdminRepository