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
            const response = yield this._adminRepository.blockTutor(id);
            return response;
        });
    }
    blockStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminRepository.blockStudent(id);
            return response;
        });
    }
}
exports.default = AdminService;
