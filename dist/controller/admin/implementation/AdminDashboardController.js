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
const errorMessage_1 = require("../../../constants/errorMessage");
const statusCode_1 = require("../../../constants/statusCode");
class AdminDashboardController {
    constructor(adminDashboardService) {
        this._adminDashboardService = adminDashboardService;
    }
    getDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminDashboardService.getDashboardData();
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Dashboard data retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const response = yield this._adminDashboardService.getWallet(page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Admin wallet retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminDashboardService.getStudents();
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "students data retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getCategoryIncomeDistribution(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminDashboardService.getCategoryIncomeDistribution();
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Category wise income retrived successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getAdminMonthlyIncome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentYear = new Date().getFullYear();
                const response = yield this._adminDashboardService.getAdminMonthlyIncome(currentYear);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Admin monthly income retrived successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getAdminYearlyIncome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentYear = new Date().getFullYear();
                const response = yield this._adminDashboardService.getAdminYearlyIncome(currentYear);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Admin yearly income retrived successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getAdminIncomeByDateRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                if (!startDate || !endDate) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Start date and end date are required", data: null });
                    return;
                }
                const start = new Date(startDate);
                const end = new Date(endDate);
                const response = yield this._adminDashboardService.getAdminIncomeByDateRange(start.toISOString(), end.toISOString());
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Admin income by date range retrived successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
}
exports.default = AdminDashboardController;
