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
class StudentService {
    constructor(studentRepository) {
        this._studentRepository = studentRepository;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield this._studentRepository.findByEmail(email);
            return getUser;
        });
    }
    createUser(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this._studentRepository.create({ username, email, password });
            return newUser;
        });
    }
    updateUser(email, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this._studentRepository.updateUserByEmail(email, data);
            return updatedUser;
        });
    }
    storeUserOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOtp = yield this._studentRepository.storeOtpInDb(email, otp);
            return storedOtp;
        });
    }
    getOtpByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield this._studentRepository.findOtpByemail(email);
            return otp;
        });
    }
    storeUserResendOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOtp = yield this._studentRepository.storeResendOtpInDb(email, otp);
            return storedOtp;
        });
    }
    // async loginUser(email: string): Promise<IStudent | null> {
    //     const user = await this._studentRepository.findByEmail(email);   
    //     return user
    // }
    isBlocked(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._studentRepository.isBlocked(_id);
            return user;
        });
    }
}
exports.default = StudentService;
