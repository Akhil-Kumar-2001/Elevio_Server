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
const statusCode_1 = require("../../../constants/statusCode");
const errorMessage_1 = require("../../../constants/errorMessage");
class TutorProfileController {
    constructor(tutorProfileService) {
        this._tutorProfileService = tutorProfileService;
    }
    getTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ error: errorMessage_1.ERROR_MESSAGES.BAD_REQUEST });
                }
                const tutor = yield this._tutorProfileService.getTutorById(id);
                if (!tutor) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ error: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                    return;
                }
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Tutor found ", data: tutor });
            }
            catch (error) {
                console.error("Error fetching tutor:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    verifyTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { formData } = req.body;
                console.log(formData.profile.documents);
                const response = yield this._tutorProfileService.verifyTutor(formData);
                if (!response) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ error: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                    return;
                }
                res.status(200).json({ success: true, message: "Form submitted Successfully", data: response });
            }
            catch (error) {
                console.log("Error verifying tutor:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, formData } = req.body;
                const response = yield this._tutorProfileService.updateProfile(id, formData);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Profile updated Successfully", data: response });
                }
            }
            catch (error) {
                console.log("Error updating profile:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    createSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionData } = req.body;
                console.log("session data from frontend", sessionData);
                const sessionExist = yield this._tutorProfileService.sessionExist(sessionData);
                console.log("exist sessions", sessionExist);
                if (sessionExist) {
                    res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ success: false, message: "Already hava a session in this time period", data: null });
                    return;
                }
                const response = yield this._tutorProfileService.createSession(sessionData);
                res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, message: "Session scheduled successfully", data: response });
            }
            catch (error) {
                console.log("Error creating session:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.userId;
                const response = yield this._tutorProfileService.getSessions(tutorId);
                console.log("retrived session sorted", response);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Scheduled session retrieved Successfully", data: response });
                }
            }
            catch (error) {
                console.log("Error while fetching session data :", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getSessionDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this._tutorProfileService.getSessionDetails(id);
                console.log("retrived session details", response);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Session details retrieved Successfully", data: response });
                }
            }
            catch (error) {
                console.log("Error while fetching session details :", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    updateSessionStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const response = yield this._tutorProfileService.updateSessionStatus(id, status);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Session details retrieved Successfully", data: response });
                }
            }
            catch (error) {
                console.log("Error while fetching session details :", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.default = TutorProfileController;
