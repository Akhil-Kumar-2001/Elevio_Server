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
const _otpModel_1 = require("../../../model/otp/ otpModel");
const BaseRepository_1 = require("../../base/implementation/BaseRepository");
class StudentRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(studentModel_1.Student);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield studentModel_1.Student.findOne({ email: email });
            return getUser;
        });
    }
    // async createUser(username: string, email: string, password: string): Promise<IStudent | null> {
    //     const newUser = await Student.create({username,email,password});
    //     return newUser;
    // }
    updateUserByEmail(email, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield studentModel_1.Student.findOneAndUpdate({ email }, data, { new: true });
            return updatedUser;
        });
    }
    updateUserStatus(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield studentModel_1.Student.findOneAndUpdate({ email }, { $set: { status: 1 } }, { new: true });
            return updatedUser;
        });
    }
    storeOtpInDb(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOtp = yield _otpModel_1.OTP.create({ email, otp });
            return storedOtp;
        });
    }
    findOtpByemail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield _otpModel_1.OTP.findOne({ email: email });
            return otp;
        });
    }
    storeResendOtpInDb(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedOtp = yield _otpModel_1.OTP.findOneAndUpdate({ email }, { otp }, { new: true });
            return storedOtp;
        });
    }
    // async loginUser(email:string, password:string): Promise<IStudent | null> {
    //     const user = await Student.findOne({email})
    //     return user
    // }
    isBlocked(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield studentModel_1.Student.findById({ _id });
            return user === null || user === void 0 ? void 0 : user.status;
        });
    }
}
exports.default = StudentRepository;
