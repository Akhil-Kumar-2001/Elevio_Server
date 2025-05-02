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
class StudentCourseController {
    constructor(studentCourseService) {
        this._studentCourseService = studentCourseService;
    }
    getListedCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._studentCourseService.getListedCourse();
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Listed course Retrieved successfully", data: response });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getTopRatedCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._studentCourseService.getTopRatedCourse();
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Listed course Retrieved successfully", data: response });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.body.userId;
                const isPurchased = yield this._studentCourseService.isPurchased(id, userId);
                if (isPurchased) {
                    res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ success: true, message: "Course Already Purchased", data: isPurchased });
                    return;
                }
                const courseExist = yield this._studentCourseService.courseExist(id, userId);
                if (courseExist) {
                    res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ success: true, message: "Course Already exist On Cart", data: courseExist });
                    return;
                }
                const response = yield this._studentCourseService.addToCart(id, userId);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Add To Cart Successfully", data: response });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this._studentCourseService.getCart(id);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Retrived cart details successfully", data: response !== null && response !== void 0 ? response : {} });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    removeItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const studentId = req.query.studentId;
                console.log(studentId);
                const response = yield this._studentCourseService.removeItem(id, studentId);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Course Removed from cart successfully", data: response });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId, amount, courseIds } = req.body;
                if (!studentId || !amount || !courseIds) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND, data: null });
                    return;
                }
                const response = yield this._studentCourseService.createOrder(studentId, amount, courseIds);
                res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, message: "Order created successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Request data for verfiy payment", req.body);
            try {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
                const response = yield this._studentCourseService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
                console.log("controlelr response", response);
                res.status(response == "success" ? statusCode_1.STATUS_CODES.OK : statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: response === "success", message: response === "success" ? "Payment successful" : "Payment failed", status: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._studentCourseService.getCategories();
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Categories retrieved true", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 8;
                const response = yield this._studentCourseService.getCourses(page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Courses retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getPurchasedCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this._studentCourseService.getPurchasedCourses(id);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Purchased courses retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield this._studentCourseService.getCourse(id);
            res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Course details retrieved successfully", data: response });
        });
    }
    getTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield this._studentCourseService.getTutor(id);
            res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Tutor details retrieved successfully", data: response });
        });
    }
    getSections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                console.log(courseId);
                const response = yield this._studentCourseService.getSections(courseId);
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
                const { courseId } = req.params;
                const response = yield this._studentCourseService.getLectures(courseId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Lectures retrieved successfully", data: response });
            }
            catch (error) {
                console.log("Error while fetching Lectures");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._studentCourseService.getSubscription();
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Subscription retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    createSubscritionOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId, amount, planId } = req.body;
                if (!studentId || !amount || !planId) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND, data: null });
                    return;
                }
                const validplan = yield this._studentCourseService.isValidPlan(studentId);
                if (validplan) {
                    res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ success: false, message: "You are currently in an active plan. Unable to purchase new plan!", data: null });
                    return;
                }
                const response = yield this._studentCourseService.createSubscritionOrder(studentId, amount, planId);
                res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, message: "Order created successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    verifySubscriptionPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Request data for verfiy sub payment", req.body);
            try {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
                const response = yield this._studentCourseService.verifySubscriptionPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
                console.log("controlelr response", response);
                res.status(response == "paid" ? statusCode_1.STATUS_CODES.OK : statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: response === "paid", message: response === "paid" ? "Payment successful" : "Payment failed", status: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this._studentCourseService.getReviews(id);
                console.log("get review response in controller =>>>>>>>>>>>>>", response);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Review retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { formData } = req.body;
                console.log("form data", formData);
                const response = yield this._studentCourseService.createReview(formData);
                console.log("Response create review", response);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, message: "Review added Successfully", data: response });
                }
                else {
                    res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ success: false, message: "Alread Give review to this course", data: response });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.userId;
                const response = yield this._studentCourseService.getProgress(id, userId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "progress get Successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    addLectureToProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId, lectureId } = req.body;
                const userId = req.userId;
                const response = yield this._studentCourseService.addLectureToProgress(userId, courseId, lectureId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "progress updated Successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    editReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { formData } = req.body;
                const response = yield this._studentCourseService.editReview(id, formData);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Review updated Successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this._studentCourseService.deleteReview(id);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Review deleted Successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const response = yield this._studentCourseService.getWishlist(userId);
                console.log("Wishlist response", response);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Wishlist retrieved successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    addToWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.userId;
                const isInWishlist = yield this._studentCourseService.isInWishlist(userId, id);
                console.log("isInWishlist", isInWishlist);
                if (isInWishlist) {
                    res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ success: true, message: "Course Already exist On Wishlist", data: isInWishlist });
                    return;
                }
                const response = yield this._studentCourseService.addToWishlist(userId, id);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Add To Wishlist Successfully", data: response });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    removeFromWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const studentId = req.userId;
                console.log(studentId);
                const response = yield this._studentCourseService.removeFromWishlist(studentId, id);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Course Removed from Wishlist successfully", data: response });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
}
exports.default = StudentCourseController;
