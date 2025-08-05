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
const courseMapper_1 = require("../../../mapper/course/courseMapper");
const orderMapper_1 = require("../../../mapper/order/orderMapper");
const categoryMapper_1 = require("../../../mapper/category/categoryMapper");
const tutorMapper_1 = require("../../../mapper/tutor/tutorMapper");
const sectionMapper_1 = require("../../../mapper/section/sectionMapper");
const lectureMapper_1 = require("../../../mapper/lecture/lectureMapper");
const subscriptionMapper_1 = require("../../../mapper/subscription/subscriptionMapper");
const reviewMapper_1 = require("../../../mapper/review/reviewMapper");
const progressMapper_1 = require("../../../mapper/progress/progressMapper");
const awsConfig_1 = __importDefault(require("../../../Config/awsConfig"));
const cloudinaryUtility_1 = require("../../../utils/cloudinaryUtility");
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
            if (!courses)
                return null;
            for (const course of courses) {
                if (course.imageThumbnail) {
                    course.imageThumbnail = (0, cloudinaryUtility_1.getSignedImageUrl)(course.imageThumbnail);
                }
            }
            const dto = (0, courseMapper_1.mapCoursesToDto)(courses);
            return dto;
        });
    }
    getTopRatedCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this._studentCourseRepository.getTopRatedCourse();
            if (!courses)
                return null;
            for (const course of courses) {
                if (course.imageThumbnail) {
                    course.imageThumbnail = (0, cloudinaryUtility_1.getSignedImageUrl)(course.imageThumbnail);
                }
            }
            const dto = (0, courseMapper_1.mapCoursesToDto)(courses);
            return dto;
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
            if (!response)
                return null;
            for (const course of response === null || response === void 0 ? void 0 : response.items) {
                if (course.courseImage) {
                    course.courseImage = (0, cloudinaryUtility_1.getSignedImageUrl)(course.courseImage);
                }
            }
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
            if (!createdOrder)
                return null;
            const dto = (0, orderMapper_1.mapOrderToDto)(createdOrder);
            return dto;
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
            if (!response)
                return null;
            const dto = (0, categoryMapper_1.mapCategoriesToDto)(response);
            return dto;
        });
    }
    getCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getCourses(page, limit);
            if (!response)
                return null;
            // Convert imageThumbnail to signed URL for each course
            for (const course of response.courses) {
                if (course.imageThumbnail) {
                    course.imageThumbnail = (0, cloudinaryUtility_1.getSignedImageUrl)(course.imageThumbnail);
                }
            }
            const dto = (0, courseMapper_1.mapCoursesToDto)(response.courses);
            return { data: dto, totalRecord: response.totalRecord };
        });
    }
    searchCourse(query, page, limit, category, priceRange, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._studentCourseRepository.searchCourse(query, page, limit, category !== null && category !== void 0 ? category : "", priceRange !== null && priceRange !== void 0 ? priceRange : [0, 5000], sortOrder !== null && sortOrder !== void 0 ? sortOrder : null);
            if (!course)
                return null;
            const dto = {
                data: course.data.map(courseMapper_1.mapToCourseSearchDto),
                totalRecord: course.totalRecord,
            };
            return dto;
        });
    }
    getPurchasedCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this._studentCourseRepository.getPurchasedCourses(userId);
            if (!courses)
                return null;
            for (const course of courses) {
                if (course.imageThumbnail) {
                    course.imageThumbnail = (0, cloudinaryUtility_1.getSignedImageUrl)(course.imageThumbnail);
                }
            }
            const dto = (0, courseMapper_1.mapCoursesToDto)(courses);
            return dto;
        });
    }
    getSections(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = yield this._studentCourseRepository.getSections(id);
            if (!sections)
                return null;
            const dto = (0, sectionMapper_1.MapToSectionsDto)(sections);
            return dto;
        });
    }
    getSignedVideoUrl(lectureId_1) {
        return __awaiter(this, arguments, void 0, function* (lectureId, expiresInSeconds = 300) {
            const lecture = yield this._studentCourseRepository.findById(lectureId);
            if (!lecture) {
                throw new Error(`Lecture with id ${lectureId} not found.`);
            }
            if (!lecture.videoKey) {
                throw new Error("Video key not found for this lecture.");
            }
            const signedUrl = yield awsConfig_1.default.getSignedUrlPromise("getObject", {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: lecture.videoKey,
                Expires: expiresInSeconds,
            });
            return signedUrl;
        });
    }
    getLectures(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lectures = yield this._studentCourseRepository.getLectures(id);
            if (!lectures)
                return null;
            const lecturesWithSignedUrls = yield Promise.all(lectures.map((lecture) => __awaiter(this, void 0, void 0, function* () {
                let videoUrl = null;
                if (lecture.videoKey) {
                    try {
                        videoUrl = yield this.getSignedVideoUrl(lecture._id);
                    }
                    catch (error) {
                        console.error(`Error generating signed URL for lecture ${lecture._id}`, error);
                    }
                }
                return Object.assign(Object.assign({}, lecture.toObject()), { videoUrl });
            })));
            const dto = (0, lectureMapper_1.mapLecturesToDto)(lecturesWithSignedUrls);
            return dto;
        });
    }
    getCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getCourse(id);
            if (!response)
                return null;
            if (response.imageThumbnail) {
                response.imageThumbnail = (0, cloudinaryUtility_1.getSignedImageUrl)(response.imageThumbnail);
            }
            const dto = (0, courseMapper_1.mapCourseResponseToDto)(response);
            return dto;
        });
    }
    getTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getTutor(id);
            if (!response)
                return null;
            const dto = (0, tutorMapper_1.mapTutorToDto)(response);
            return dto;
        });
    }
    getSubscription() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getSubscription();
            if (!response)
                return null;
            const dto = (0, subscriptionMapper_1.mapSubscriptionsToDto)(response);
            return dto;
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
            console.log(order);
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
            if (!response)
                return null;
            const dto = (0, reviewMapper_1.mapReviewsReponseToDtoList)(response);
            return dto;
        });
    }
    createReview(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.createReview(formData);
            if (!response)
                return null;
            const dto = (0, reviewMapper_1.mapReviewReponseToDto)(response);
            return dto;
        });
    }
    getProgress(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.getProgress(courseId, userId);
            if (!response)
                return null;
            const dto = (0, progressMapper_1.mapProgressToDto)(response);
            return dto;
        });
    }
    addLectureToProgress(userId, courseId, lectureId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.addLectureToProgress(userId, courseId, lectureId);
            if (!response)
                return null;
            const dto = (0, progressMapper_1.mapProgressToDto)(response);
            return dto;
        });
    }
    editReview(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._studentCourseRepository.editReview(id, formData);
            if (!response)
                return null;
            const dto = (0, reviewMapper_1.mapReviewToDto)(response);
            return dto;
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
            const courses = yield this._studentCourseRepository.getWishlist(userId);
            if (!courses)
                return null;
            for (const course of courses) {
                if (course.imageThumbnail) {
                    course.imageThumbnail = (0, cloudinaryUtility_1.getSignedImageUrl)(course.imageThumbnail);
                }
            }
            const dto = (0, courseMapper_1.mapCoursesToDto)(courses);
            return dto;
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
