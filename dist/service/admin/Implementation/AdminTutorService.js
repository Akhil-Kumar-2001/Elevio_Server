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
const socketConfig_1 = require("../../../Config/socketConfig");
class AdminTutorService {
    constructor(adminTutorRepository) {
        this._adminTutorRepository = adminTutorRepository;
    }
    getPendingTutors(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutors = yield this._adminTutorRepository.getPendingTutors(page, limit);
            return tutors;
        });
    }
    getTutorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this._adminTutorRepository.getTutorById(id);
            return tutor;
        });
    }
    rejectTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reject = yield this._adminTutorRepository.rejectTutor(id);
            return reject;
        });
    }
    approveTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const approve = yield this._adminTutorRepository.approveTutor(id);
            return approve;
        });
    }
    findCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this._adminTutorRepository.findCategory(name);
            return category;
        });
    }
    createCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this._adminTutorRepository.createCategory(name);
            return category;
        });
    }
    getCategories(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this._adminTutorRepository.getCategories(page, limit);
            return categories;
        });
    }
    blockCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminTutorRepository.blockCategory(id);
            return response;
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminTutorRepository.deleteCategory(id);
            return response;
        });
    }
    pendingCourse(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminTutorRepository.pendingCourse(page, limit);
            return response;
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this._adminTutorRepository.getCategory();
            return categories;
        });
    }
    courseDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._adminTutorRepository.courseDetails(id);
            return course;
        });
    }
    getCategoryName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminTutorRepository.getCategoryName(id);
            return response;
        });
    }
    getSections(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = yield this._adminTutorRepository.getSections(id);
            return sections;
        });
    }
    getLectures(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminTutorRepository.getLectures(id);
            return response;
        });
    }
    rejectCourse(id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminTutorRepository.rejectCourse(id, reason);
            if (response) {
                const receiverSocketId = (0, socketConfig_1.getReceiverSocketId)(response.receiverId.toString());
                const io = (0, socketConfig_1.getIO)();
                if (receiverSocketId && io) {
                    io.to(receiverSocketId).emit("newNotification", response);
                }
            }
            if (response) {
                return true;
            }
            return null;
        });
    }
    getTutorMail(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = yield this._adminTutorRepository.getTutorMail(tutorId);
            return email;
        });
    }
    approveCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminTutorRepository.approveCourse(id);
            return response;
        });
    }
    getSubscription(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminTutorRepository.getSubscription(page, limit);
            return response;
        });
    }
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminTutorRepository.createSubscription(data);
            return response;
        });
    }
    editSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminTutorRepository.editSubscription(data);
            return response;
        });
    }
    deleteSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminTutorRepository.deleteSubscription(id);
            return response;
        });
    }
    getTutorsWalltes(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallets = yield this._adminTutorRepository.getTutorsWalltes(page, limit);
            return wallets;
        });
    }
    getTutorsList() {
        return __awaiter(this, void 0, void 0, function* () {
            const tutors = yield this._adminTutorRepository.getTutorsList();
            return tutors;
        });
    }
}
exports.default = AdminTutorService;
