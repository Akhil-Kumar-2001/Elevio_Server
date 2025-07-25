import { IStudent } from '../../model/student/studentModel';
import { IStudentDto } from '../../dtos/student/studentDto'; // Update based on your naming

export const mapStudentToDto = (student: IStudent): IStudentDto => {
  return {
    _id: student._id,
    username: student.username,
    email: student.email,
    status: student.status,
    role: student.role,
    googleID: student.googleID,
    enrolledCourseCount: student.enrolledCourseCount,
    profilePicture: student.profilePicture,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt
  };
};

export const mapStudentsToDto = (students: IStudent[]): IStudentDto[] => {
  return students.map(mapStudentToDto);
};
