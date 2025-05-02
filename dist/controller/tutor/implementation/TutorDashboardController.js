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
class TutorDashboardController {
    constructor(tutorDashboardService) {
        this._tutorDashboardService = tutorDashboardService;
    }
    getMonthlyIncome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.userId;
                const response = yield this._tutorDashboardService.getMonthlyIncome(tutorId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Monthly income retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getStudentsCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.userId;
                const response = yield this._tutorDashboardService.getStudentsCount(tutorId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Students count retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const response = yield this._tutorDashboardService.getTransactions(tutorId, page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Transaction data retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getDashboradDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.userId;
                const response = yield this._tutorDashboardService.getDashboradDetails(tutorId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Dashboard data retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getYearlyIncome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.userId;
                const response = yield this._tutorDashboardService.getYearlyIncome(tutorId);
                console.log("in controller", response);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Monthly income retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getIncomeByDateRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.userId;
                const { startDate, endDate } = req.query;
                if (!startDate || !endDate) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Please provide start and end date", data: null });
                    return;
                }
                const start = new Date(startDate);
                const end = new Date(endDate);
                const response = yield this._tutorDashboardService.getIncomeByDateRange(tutorId, start, end);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Income by date range retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
}
exports.default = TutorDashboardController;
