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
class TutorProfileService {
    constructor(tutorProfileRepository) {
        this._tutorProfileRepository = tutorProfileRepository;
    }
    getTutorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this._tutorProfileRepository.getTutorById(id);
            return tutor;
        });
    }
    verifyTutor(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this._tutorProfileRepository.verifyTutor(formData);
            return tutor;
        });
    }
    updateProfile(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedTutor = yield this._tutorProfileRepository.updateProfile(id, formData);
            return updatedTutor;
        });
    }
    sessionExist(sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorProfileRepository.sessionExist(sessionData);
            return response;
        });
    }
    createSession(sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorProfileRepository.createSession(sessionData);
            return response;
        });
    }
    getSessions(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorProfileRepository.getSessions(tutorId);
            return response;
        });
    }
    getSessionDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorProfileRepository.getSessionDetails(id);
            return response;
        });
    }
    updateSessionStatus(_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorProfileRepository.updateSessionStatus(_id, status);
            return response;
        });
    }
}
exports.default = TutorProfileService;
