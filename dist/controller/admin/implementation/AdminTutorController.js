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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorMessage_1 = require("../../../constants/errorMessage");
const statusCode_1 = require("../../../constants/statusCode");
const mailUtility_1 = __importDefault(require("../../../utils/mailUtility"));
class AdminTutorController {
    constructor(adminTutorService) {
        this._adminTutorService = adminTutorService;
    }
    getPendingTutors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const tutors = yield this._adminTutorService.getPendingTutors(page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Pending tutors Retrived", data: tutors });
            }
            catch (error) {
                console.error("Error while retriving Tutors data.", error);
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Tutors data Retrived failed", data: null });
                return;
            }
        });
    }
    getTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ error: errorMessage_1.ERROR_MESSAGES.BAD_REQUEST });
                }
                const tutor = yield this._adminTutorService.getTutorById(id);
                if (!tutor) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ error: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                    return;
                }
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Tutor found ", data: tutor });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    rejectTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const response = yield this._adminTutorService.rejectTutor(id);
                if (!response) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND, data: null });
                    return;
                }
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Tutor rejected successfully", data: response });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    approveTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const response = yield this._adminTutorService.approveTutor(id);
                if (!response) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND, data: null });
                    return;
                }
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Tutor approved successfully", data: response });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                console.log("category name", name);
                const category = yield this._adminTutorService.findCategory(name);
                console.log("is category exist", category);
                if (category) {
                    res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ success: false, message: "Category already exists", data: null });
                }
                else {
                    const response = yield this._adminTutorService.createCategory(name);
                    console.log("is category created", response);
                    res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, message: "Category created Successfully", data: response });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const response = yield this._adminTutorService.getCategories(page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({
                    success: true,
                    message: "Categories retrieved successfully",
                    data: response
                });
            }
            catch (error) {
                console.error("Error fetching categories", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error fetching categories" });
            }
        });
    }
    blockCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const response = yield this._adminTutorService.blockCategory(id);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Change status success", data: response });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.body.id;
                console.log("id from delete category backend", id);
                const response = yield this._adminTutorService.deleteCategory(id);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Category deleted Successfully", data: response });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    pendingCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const courses = yield this._adminTutorService.pendingCourse(page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Pending Courses Retrived", data: courses });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Courses data Retrived failed", data: null });
            }
        });
    }
    getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminTutorService.getCategory();
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Categories retrieved Successfully", data: response });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    courseDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this._adminTutorService.courseDetails(id);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Course details retrieved Successfully", data: response });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getCategoryName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this._adminTutorService.getCategoryName(id);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Category name retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getSections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(id);
                const response = yield this._adminTutorService.getSections(id);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Sections retrieved Successfully", data: response });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getLectures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this._adminTutorService.getLectures(id);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Lectures retrieved successfully", data: response });
            }
            catch (error) {
                console.log("Error while fetching Lectures");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Lectures" });
            }
        });
    }
    rejectCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const reason = req.body.reason;
                const tutorId = req.body.tutorId;
                const email = yield this._adminTutorService.getTutorMail(tutorId);
                // console.log(object)
                const response = yield this._adminTutorService.rejectCourse(id, reason);
                if (!response) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND, data: null });
                    return;
                }
                if (response && email) {
                    yield mailUtility_1.default.sendMail(email, reason, "Course Rejection");
                }
                else if (!email) {
                    console.log("Email not found for tutor, skipping email notification");
                }
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Course rejected successfully", data: response });
            }
            catch (error) {
                console.log("Error while rejecting Course");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while Rejecting course" });
            }
        });
    }
    approveCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this._adminTutorService.approveCourse(id);
                if (!response) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND, data: null });
                    return;
                }
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Course approved successfully", data: response });
            }
            catch (error) {
                console.log("Error while rejecting Course");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while Rejecting course" });
            }
        });
    }
    getSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 3;
                const response = yield this._adminTutorService.getSubscription(page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: false, message: "Subscription retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    createSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const response = yield this._adminTutorService.createSubscription(data);
                res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, message: "Subscription created successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    editSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                console.log("Edited data", data);
                const response = yield this._adminTutorService.editSubscription(data);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Subscription Edited successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    deleteSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log("Edited data", id);
                const response = yield this._adminTutorService.deleteSubscription(id);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Subscription Edited successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getTutorsWalltes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const walltes = yield this._adminTutorService.getTutorsWalltes(page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "tutor wallets Retrived", data: walltes });
            }
            catch (error) {
                console.error("Error while retriving Tutors walltes.", error);
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Tutors wallets Retrived failed", data: null });
                return;
            }
        });
    }
    getTutorsList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutors = yield this._adminTutorService.getTutorsList();
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Tutor  data Retrived", data: tutors });
            }
            catch (error) {
                console.error("Error while retriving Tutors data.", error);
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Tutors data Retrived failed", data: null });
                return;
            }
        });
    }
}
exports.default = AdminTutorController;
