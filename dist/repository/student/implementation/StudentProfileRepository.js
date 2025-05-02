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
const mongoose_1 = require("mongoose");
const sessionModel_1 = require("../../../model/sessiion/sessionModel");
const studentModel_1 = require("../../../model/student/studentModel");
const SubscriptionPurchased_1 = require("../../../model/subscription/SubscriptionPurchased");
const tutorModel_1 = require("../../../model/tutor/tutorModel");
class StudentProfileRepository {
    getStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield studentModel_1.Student.findOne({ _id: id });
            return student;
        });
    }
    getSubscriptionDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield SubscriptionPurchased_1.SubscriptionPurchased.findOne({
                    userId: id,
                    status: 'active',
                    paymentStatus: 'paid'
                })
                    .populate('planId')
                    .sort({ createdAt: -1 });
                return subscription;
            }
            catch (error) {
                return null;
            }
        });
    }
    editProfile(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedStudent = yield studentModel_1.Student.findByIdAndUpdate(id, { $set: formData }, { new: true });
            return updatedStudent ? updatedStudent : null;
        });
    }
    getSessions(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get current time
                const currentTime = new Date();
                // First get the session documents
                const sessions = yield sessionModel_1.Session.find({
                    studentId,
                    status: { $in: ['scheduled', 'active'] },
                    // Ensure the session's end time (startTime + duration) is less than current time
                    $expr: {
                        $gte: [
                            { $add: ["$startTime", { $multiply: ["$duration", 60000] }] }, // duration in milliseconds
                            currentTime
                        ]
                    }
                });
                // For each session, get the student information
                const result = yield Promise.all(sessions.map((session) => __awaiter(this, void 0, void 0, function* () {
                    const tutor = yield tutorModel_1.Tutor.findById(session.tutorId);
                    return {
                        _id: session._id,
                        tutorName: (tutor === null || tutor === void 0 ? void 0 : tutor.username) || 'Unknown',
                        startTime: session.startTime,
                        duration: session.duration,
                        status: session.status,
                        roomId: session.roomId,
                    };
                })));
                // Sort the results by startTime in ascending order
                const sortedResult = result.sort((a, b) => {
                    return a.startTime.getTime() - b.startTime.getTime();
                });
                return sortedResult;
            }
            catch (error) {
                console.error("Error getting sessions:", error);
                return null;
            }
        });
    }
    getSessionDetails(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield sessionModel_1.Session.findOne({ _id });
            return session;
        });
    }
    updateSessionStatus(_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("iam here on update session repo", status);
            const session = yield sessionModel_1.Session.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(_id) }, { $set: { status } }, { new: true });
            console.log("iam here on update session repo session", session);
            return session ? true : null;
        });
    }
}
exports.default = StudentProfileRepository;
