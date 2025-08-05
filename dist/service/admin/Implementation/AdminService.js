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
const studentMapper_1 = require("../../../mapper/student/studentMapper");
const tutorMapper_1 = require("../../../mapper/tutor/tutorMapper");
class AdminService {
    constructor(adminRepository) {
        this._adminRepository = adminRepository;
    }
    getStudents(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield this._adminRepository.getStudents(page, limit);
            return students;
        });
    }
    getTutors(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutors = yield this._adminRepository.getTutors(page, limit);
            return tutors;
        });
    }
    blockTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this._adminRepository.blockTutor(id);
            if (!tutor)
                return null;
            const dto = (0, tutorMapper_1.mapTutorToDto)(tutor);
            return dto;
        });
    }
    blockStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._adminRepository.blockStudent(id);
            if (!student)
                return null;
            const dto = (0, studentMapper_1.mapStudentToDto)(student);
            return dto;
        });
    }
    searchTutor(query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this._adminRepository.searchTutor(query, page, limit);
            if (!tutor)
                return null;
            const dto = (0, tutorMapper_1.mapTutorsToDto)(tutor.data);
            return { data: dto, totalRecord: tutor.totalRecord };
        });
    }
    searchStudents(query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield this._adminRepository.searchStudents(query, page, limit);
            if (!students)
                return null;
            const dto = (0, studentMapper_1.mapStudentsToDto)(students.data);
            return { data: dto, totalRecord: students.totalRecord };
        });
    }
}
exports.default = AdminService;
