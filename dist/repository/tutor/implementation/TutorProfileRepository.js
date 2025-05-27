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
const tutorModel_1 = require("../../../model/tutor/tutorModel");
const sessionModel_1 = require("../../../model/sessiion/sessionModel");
const studentModel_1 = require("../../../model/student/studentModel");
class TutorProfileRepository {
    getTutorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield tutorModel_1.Tutor.findById(id);
            return tutor;
        });
    }
    verifyTutor(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedTutor = yield tutorModel_1.Tutor.findByIdAndUpdate(formData._id, {
                $set: {
                    isVerified: formData.isVerified,
                    "profile.bio": formData.profile.bio,
                    "profile.experience": formData.profile.experience,
                    "profile.qualification": formData.profile.qualification,
                    "profile.skills": formData.profile.skills,
                    "profile.documents": formData.profile.documents,
                },
            }, { new: true } // Return the updated document
            );
            return updatedTutor;
        });
    }
    updateProfile(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedTutor = yield tutorModel_1.Tutor.findByIdAndUpdate(id, { $set: formData }, { new: true });
            return updatedTutor ? true : false;
        });
    }
    sessionExist(sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const start = new Date(sessionData.startTime);
                const end = new Date(start.getTime() + sessionData.duration * 60000); // end time in ms
                const existingSession = yield sessionModel_1.Session.findOne({
                    tutorId: sessionData.tutorId,
                    status: 'scheduled',
                    startTime: {
                        $lt: end, // existing session starts before the new one ends
                    },
                    $expr: {
                        $gt: [
                            { $add: ["$startTime", { $multiply: ["$duration", 60000] }] }, // existing endTime
                            start, // existing session ends after the new one starts
                        ]
                    }
                });
                return existingSession ? true : false;
            }
            catch (error) {
                console.error("Error checking session existence:", error);
                return null;
            }
        });
    }
    createSession(sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = new sessionModel_1.Session(sessionData);
                yield session.save();
                return true;
            }
            catch (error) {
                console.error("Error creating session:", error);
                return null;
            }
        });
    }
    getSessions(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get current time
                const currentTime = new Date();
                // Find sessions that are scheduled or active and have not ended
                const sessions = yield sessionModel_1.Session.find({
                    tutorId,
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
                    const student = yield studentModel_1.Student.findById(session.studentId);
                    return {
                        _id: session._id,
                        studentName: (student === null || student === void 0 ? void 0 : student.username) || 'Unknown',
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
                console.log("sortedResult", sortedResult);
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
exports.default = TutorProfileRepository;
