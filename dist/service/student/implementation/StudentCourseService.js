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
const razorpay_1 = __importDefault(require("razorpay"));
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
class StudentCourseService {
    constructor(studentCourseRepository) {
        this._studentCourseRepository = studentCourseRepository;
        this._razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    getListedCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this._studentCourseRepository.getListedCourse();
            return courses;
        });
    }
    getTopRatedCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this._studentCourseRepository.getTopRatedCourse();
            return courses;
        });
    }
    addToCart(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.addToCart(id, userId);
            return response;
        });
    }
    courseExist(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.courseExist(id, userId);
            return response;
        });
    }
    isPurchased(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.isPurchased(id, userId);
            return response;
        });
    }
    getCart(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getCart(studentId);
            return response;
        });
    }
    removeItem(id, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.removeItem(id, studentId);
            return response;
        });
    }
    createOrder(studentId, amount, courseIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                amount: amount * 100,
                currency: "INR",
                receipt: `order_rcptid_${studentId}`,
                payment_capture: 1,
            };
            const razorpayOrder = yield this._razorpay.orders.create(options);
            const orderData = {
                userId: new mongoose_1.Types.ObjectId(studentId),
                courseIds: courseIds.map((id) => new mongoose_1.Types.ObjectId(id)),
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                status: "pending",
                paymentMethod: "razorpay",
            };
            const createdOrder = yield this._studentCourseRepository.createOrder(orderData);
            console.log("c", createdOrder);
            return createdOrder;
        });
    }
    verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const expectedSignature = crypto_1.default
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(razorpay_order_id + "|" + razorpay_payment_id)
                .digest("hex");
            if (expectedSignature !== razorpay_signature) {
                throw new Error("Payment signature verification failed");
            }
            const payment = yield this._razorpay.payments.fetch(razorpay_payment_id);
            console.log("payment status capture", payment.status);
            if (payment.status === "captured") {
                const updatedOrder = yield this._studentCourseRepository.updateByOrderId(razorpay_order_id, "success");
                return updatedOrder;
            }
            else {
                const updatedOrder = yield this._studentCourseRepository.updateByOrderId(razorpay_order_id, "failed");
                return updatedOrder;
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getCategories();
            return response;
        });
    }
    getCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getCourses(page, limit);
            return response;
        });
    }
    getPurchasedCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getPurchasedCourses(userId);
            return response;
        });
    }
    getSections(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = yield this._studentCourseRepository.getSections(id);
            return sections;
        });
    }
    getLectures(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getLectures(id);
            return response;
        });
    }
    getCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getCourse(id);
            return response;
        });
    }
    getTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getTutor(id);
            return response;
        });
    }
    getSubscription() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getSubscription();
            return response;
        });
    }
    isValidPlan(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.isValidPlan(studentId);
            return response;
        });
    }
    createSubscritionOrder(studentId, amount, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                amount: amount * 100,
                currency: "INR",
                receipt: `order_rcptid_${studentId}`,
                payment_capture: 1,
            };
            const razorpayOrder = yield this._razorpay.orders.create(options);
            console.log("rz", razorpayOrder);
            const orderData = {
                userId: new mongoose_1.Types.ObjectId(studentId),
                planId: new mongoose_1.Types.ObjectId(planId),
                startDate: null,
                endDate: null,
                orderId: razorpayOrder.id,
                status: "pending",
                paymentStatus: "pending",
                paymentDetails: {
                    paymentAmount: Number(razorpayOrder.amount),
                    paymentMethod: "Razorpay"
                }
            };
            const order = yield this._studentCourseRepository.createSubscritionOrder(orderData);
            return order;
        });
    }
    verifySubscriptionPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const expectedSignature = crypto_1.default
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(razorpay_order_id + "|" + razorpay_payment_id)
                .digest("hex");
            if (expectedSignature !== razorpay_signature) {
                throw new Error("Payment signature verification failed");
            }
            const payment = yield this._razorpay.payments.fetch(razorpay_payment_id);
            console.log("payment status capture", payment.status);
            if (payment.status === "captured") {
                const subscription = yield this._studentCourseRepository.findByOrderId(razorpay_order_id);
                if (!subscription) {
                    return null;
                }
                const plan = yield this._studentCourseRepository.findPlanById(subscription.planId.toString());
                if (!plan) {
                    return null;
                }
                const endDate = new Date();
                if (plan.duration.unit === "day") {
                    endDate.setDate(endDate.getDate() + plan.duration.value);
                }
                else if (plan.duration.unit === "month") {
                    endDate.setMonth(endDate.getMonth() + plan.duration.value);
                }
                else if (plan.duration.unit === "quarter") {
                    endDate.setMonth(endDate.getMonth() + (plan.duration.value * 3));
                }
                else if (plan.duration.unit === "year") {
                    endDate.setFullYear(endDate.getFullYear() + plan.duration.value);
                }
                const updatedPaymentDetails = Object.assign(Object.assign({}, subscription.paymentDetails), { paymentId: razorpay_payment_id });
                console.log("updated paymentdetails", updatedPaymentDetails);
                const data = {
                    paymentStatus: "paid",
                    status: "active",
                    startDate: new Date(),
                    endDate: endDate,
                    paymentDetails: updatedPaymentDetails
                };
                const updatedSubscription = yield this._studentCourseRepository.updateSubscriptionByOrderId(razorpay_order_id, data);
                return updatedSubscription;
            }
            else {
                const updatedSubscription = yield this._studentCourseRepository.updateSubscriptionByOrderId(razorpay_order_id, {
                    paymentStatus: "failed",
                    status: "canceled",
                    paymentDetails: {
                        paymentId: razorpay_payment_id,
                    }
                });
                return updatedSubscription;
            }
        });
    }
    getReviews(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getReviews(id);
            return response;
        });
    }
    createReview(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.createReview(formData);
            return response;
        });
    }
    getProgress(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getProgress(courseId, userId);
            return response;
        });
    }
    addLectureToProgress(userId, courseId, lectureId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.addLectureToProgress(userId, courseId, lectureId);
            return response;
        });
    }
    editReview(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.editReview(id, formData);
            return response;
        });
    }
    deleteReview(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.deleteReview(id);
            return response;
        });
    }
    getWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getWishlist(userId);
            return response;
        });
    }
    addToWishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.addToWishlist(userId, courseId);
            return response;
        });
    }
    removeFromWishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.removeFromWishlist(userId, courseId);
            return response;
        });
    }
    isInWishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._studentCourseRepository.isInWishlist(userId, courseId);
        });
    }
}
exports.default = StudentCourseService;
