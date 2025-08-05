"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const studentModel_1 = require("../../../model/student/studentModel");
const tutorModel_1 = require("../../../model/tutor/tutorModel");
class AdminRepository {
    getStudents(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const students = yield studentModel_1.Student.find({}, { _id: 1, username: 1, email: 1, status: 1, role: 1, createdAt: 1 })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalRecord = yield studentModel_1.Student.countDocuments();
            return { data: students, totalRecord };
        });
    }
    getTutors(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const tutors = yield tutorModel_1.Tutor.find({}, { _id: 1, username: 1, email: 1, status: 1, role: 1, createdAt: 1 })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalRecord = yield tutorModel_1.Tutor.countDocuments();
            return { data: tutors, totalRecord };
        });
    }
    blockTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield tutorModel_1.Tutor.findById(id, { status: 1 });
            const newStatus = (tutor === null || tutor === void 0 ? void 0 : tutor.status) === 1 ? -1 : 1;
            const updatedTutor = yield tutorModel_1.Tutor.findByIdAndUpdate(id, { status: newStatus }, { new: true } // Returns the updated document
            );
            console.log(updatedTutor);
            return updatedTutor;
        });
    }
    blockStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield studentModel_1.Student.findById(id, { status: 1 });
            const newStatus = (student === null || student === void 0 ? void 0 : student.status) === 1 ? -1 : 1;
            const updatedStudent = yield studentModel_1.Student.findByIdAndUpdate(id, { status: newStatus }, { new: true } // Returns the updated document
            );
            return updatedStudent;
        });
    }
    searchTutor(query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const tutors = yield tutorModel_1.Tutor.find({
                    $or: [
                        { username: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                }, { _id: 1, username: 1, email: 1, status: 1, role: 1, createdAt: 1 })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec();
                const totalRecord = yield tutorModel_1.Tutor.countDocuments({
                    $or: [
                        { username: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                });
                return { data: tutors, totalRecord };
            }
            catch (error) {
                console.error('Error searching tutors:', error);
                return null;
            }
        });
    }
    searchStudents(query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const students = yield studentModel_1.Student.find({
                    $or: [
                        { username: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                }, { _id: 1, username: 1, email: 1, status: 1, role: 1, createdAt: 1 })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec();
                const totalRecord = yield studentModel_1.Student.countDocuments({
                    $or: [
                        { username: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                });
                return { data: students, totalRecord };
            }
            catch (error) {
                console.error('Error searching tutors:', error);
                return null;
            }
        });
    }
}
exports.default = AdminRepository;
