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
class StudentProfileController {
    constructor(studentService) {
        this._studentProfileService = studentService;
    }
    getStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.userId;
                const student = yield this._studentProfileService.getStudent(id);
                if (student) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Student data retrieved successfull", data: student });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while getting student details" });
            }
        });
    }
    getSubscriptionDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const { id } = req.params;
                const id = req.userId;
                const subscription = yield this._studentProfileService.getSubscriptionDetails(id);
                console.log(subscription);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Student data retrieved successfully", data: subscription });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    editProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { formData } = req.body;
                const response = yield this._studentProfileService.editProfile(id, formData);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Student Profile edited successfully", data: response });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while editing student profile" });
            }
        });
    }
    getSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.userId;
                const response = yield this._studentProfileService.getSessions(studentId);
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
                const response = yield this._studentProfileService.getSessionDetails(id);
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
                const response = yield this._studentProfileService.updateSessionStatus(id, status);
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
exports.default = StudentProfileController;
