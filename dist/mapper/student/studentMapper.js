"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStudentsToDto = exports.mapStudentToDto = void 0;
const mapStudentToDto = (student) => {
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
exports.mapStudentToDto = mapStudentToDto;
const mapStudentsToDto = (students) => {
    return students.map(exports.mapStudentToDto);
};
exports.mapStudentsToDto = mapStudentsToDto;
