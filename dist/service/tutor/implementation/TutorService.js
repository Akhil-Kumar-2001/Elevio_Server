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
class TutorService {
    constructor(tutorRepository) {
        this._tutorRepository = tutorRepository;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield this._tutorRepository.findByEmail(email);
            return getUser;
        });
    }
    createUser(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this._tutorRepository.create({ username, email, password });
            return newUser;
        });
    }
    createGoogleUser(username, email, password, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this._tutorRepository.createGoogleUser(username, email, password, image);
            return newUser;
        });
    }
    updateUser(email, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this._tutorRepository.updateUserByEmail(email, data);
            return updatedUser;
        });
    }
    storeUserOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOtp = yield this._tutorRepository.storeOtpInDb(email, otp);
            return storedOtp;
        });
    }
    getOtpByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield this._tutorRepository.findOtpByemail(email);
            return otp;
        });
    }
    storeUserResendOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOtp = yield this._tutorRepository.storeResendOtpInDb(email, otp);
            return storedOtp;
        });
    }
    // async loginUser(email: string, password: string): Promise<ITutor | null> {
    //     const user = await this._tutorRepository.loginUser(email,password);
    //     return user
    // }
    getTutorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this._tutorRepository.getTutorById(id);
            return tutor;
        });
    }
}
exports.default = TutorService;
