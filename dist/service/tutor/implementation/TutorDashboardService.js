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
class TutorDashboardService {
    constructor(tutorDashboardRepository) {
        this._tutorDashboardRepository = tutorDashboardRepository;
    }
    getMonthlyIncome(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorDashboardRepository.getMonthlyIncome(tutorId);
            return response;
        });
    }
    getYearlyIncome(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorDashboardRepository.getYearlyIncome(tutorId);
            return response;
        });
    }
    getStudentsCount(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorDashboardRepository.getStudentsCount(tutorId);
            return response;
        });
    }
    getTransactions(tutorId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorDashboardRepository.getTransactions(tutorId, page, limit);
            return response;
        });
    }
    getDashboradDetails(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorDashboardRepository.getDashboradDetails(tutorId);
            return response;
        });
    }
    getIncomeByDateRange(tutorId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorDashboardRepository.getIncomeByDateRange(tutorId, startDate, endDate);
            return response;
        });
    }
}
exports.default = TutorDashboardService;
