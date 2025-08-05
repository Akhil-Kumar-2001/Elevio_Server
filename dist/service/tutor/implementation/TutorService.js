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
const tutorMapper_1 = require("../../../mapper/tutor/tutorMapper");
const otpMapper_1 = require("../../../mapper/otp/otpMapper");
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
            if (!updatedUser)
                return null;
            const dto = (0, tutorMapper_1.mapTutorToDto)(updatedUser);
            return dto;
        });
    }
    storeUserOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOtp = yield this._tutorRepository.storeOtpInDb(email, otp);
            if (!storedOtp)
                return null;
            const dto = (0, otpMapper_1.mapOtpToDto)(storedOtp);
            return dto;
        });
    }
    getOtpByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield this._tutorRepository.findOtpByemail(email);
            if (!otp)
                return null;
            const dto = (0, otpMapper_1.mapOtpToDto)(otp);
            return dto;
        });
    }
    storeUserResendOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOtp = yield this._tutorRepository.storeResendOtpInDb(email, otp);
            if (!storedOtp)
                return null;
            const dto = (0, otpMapper_1.mapOtpToDto)(storedOtp);
            return dto;
        });
    }
    getTutorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this._tutorRepository.getTutorById(id);
            if (!tutor)
                return null;
            const dto = (0, tutorMapper_1.mapTutorToDto)(tutor);
            return dto;
        });
    }
}
exports.default = TutorService;
