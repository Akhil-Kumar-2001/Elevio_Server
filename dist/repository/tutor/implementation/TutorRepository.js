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
const tutorModel_1 = require("../../../model/tutor/tutorModel");
const _otpModel_1 = require("../../../model/otp/ otpModel");
const BaseRepository_1 = require("../../base/implementation/BaseRepository");
class TutorRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(tutorModel_1.Tutor);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield tutorModel_1.Tutor.findOne({ email: email });
            return getUser;
        });
    }
    // async createUser(username: string, email: string, password: string): Promise<ITutor | null> {
    //     const newUser = await Tutor.create({username,email,password});
    //     return newUser;
    // }
    createGoogleUser(username, email, password, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield tutorModel_1.Tutor.create({
                username,
                email,
                password,
                profile: {
                    profilePicture: image,
                },
            });
            return newUser;
        });
    }
    updateUserByEmail(email, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield tutorModel_1.Tutor.findOneAndUpdate({ email }, data, { new: true });
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
    // async loginUser(email:string, password:string): Promise<ITutor | null> {
    //     const user = await Tutor.findOne({email})
    //     return user
    // }
    getTutorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield tutorModel_1.Tutor.findById(id);
            return tutor;
        });
    }
}
exports.default = TutorRepository;
