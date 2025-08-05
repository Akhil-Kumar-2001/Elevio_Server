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
const sessionMapper_1 = require("../../../mapper/session/sessionMapper");
const studentMapper_1 = require("../../../mapper/student/studentMapper");
const isSubsriptionPurchasedMapper_1 = require("../../../mapper/subscription/isSubsriptionPurchasedMapper");
class StudentProfileService {
    constructor(studentProfileRepository) {
        this._studentProfileRepository = studentProfileRepository;
    }
    getStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentProfileRepository.getStudent(id);
            if (!student)
                return null;
            const dto = (0, studentMapper_1.mapStudentToDto)(student);
            return dto;
        });
    }
    getSubscriptionDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield this._studentProfileRepository.getSubscriptionDetails(id);
            if (!subscription)
                return null;
            const dto = (0, isSubsriptionPurchasedMapper_1.mapSubscriptionPurchaseToDto)(subscription);
            return dto;
        });
    }
    editProfile(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentProfileRepository.editProfile(id, formData);
            if (!student)
                return null;
            const dto = (0, studentMapper_1.mapStudentToDto)(student);
            return dto;
        });
    }
    getSessions(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentProfileRepository.getSessions(studentId);
            return response;
        });
    }
    getSessionDetails(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentProfileRepository.getSessionDetails(_id);
            if (!response)
                return null;
            const dto = (0, sessionMapper_1.mapSessionToDto)(response);
            return dto;
        });
    }
    updateSessionStatus(_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentProfileRepository.updateSessionStatus(_id, status);
            return response;
        });
    }
}
exports.default = StudentProfileService;
