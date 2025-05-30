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
class AdminDashboardService {
    constructor(adminDashboardRepository) {
        this._adminDashboardRepository = adminDashboardRepository;
    }
    getDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminDashboardRepository.getDashboardData();
            return response;
        });
    }
    getWallet(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminDashboardRepository.getWallet(page, limit);
            return response;
        });
    }
    getStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminDashboardRepository.getStudents();
            return response;
        });
    }
    getCategoryIncomeDistribution() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminDashboardRepository.getCategoryIncomeDistribution();
            return response;
        });
    }
    getAdminMonthlyIncome(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminDashboardRepository.getAdminMonthlyIncome(year);
            return response;
        });
    }
    getAdminYearlyIncome(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminDashboardRepository.getAdminYearlyIncome(year);
            return response;
        });
    }
    getAdminIncomeByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminDashboardRepository.getAdminIncomeByDateRange(startDate, endDate);
            return response;
        });
    }
}
exports.default = AdminDashboardService;
