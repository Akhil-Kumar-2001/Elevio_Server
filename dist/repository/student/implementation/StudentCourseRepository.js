"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importStar(require("mongoose"));
const courseModel_1 = require("../../../model/course/courseModel");
const cartModel_1 = require("../../../model/cart/cartModel");
const orderModel_1 = require("../../../model/order/orderModel");
const walletModel_1 = require("../../../model/wallet/walletModel");
const categoryModel_1 = require("../../../model/category/categoryModel");
const sectionModel_1 = require("../../../model/section/sectionModel");
const lectureModel_1 = require("../../../model/lecture/lectureModel");
const subscriptionModel_1 = __importDefault(require("../../../model/subscription/subscriptionModel"));
const SubscriptionPurchased_1 = require("../../../model/subscription/SubscriptionPurchased");
const studentModel_1 = require("../../../model/student/studentModel");
const tutorModel_1 = require("../../../model/tutor/tutorModel");
const review_model_1 = require("../../../model/review/review.model");
const adminwallet_1 = require("../../../model/adminwallet/adminwallet");
const progress_model_1 = require("../../../model/progress/progress.model");
const wishlist_model_1 = require("../../../model/wishlist/wishlist.model");
class StudentCourseRepository {
    getListedCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield courseModel_1.Course.find({ status: "listed" });
            return courses;
        });
    }
    getTopRatedCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield courseModel_1.Course.find({ status: "listed" }).sort({ avgRating: -1 });
            return courses;
        });
    }
    isPurchased(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield orderModel_1.Order.findOne({
                userId,
                courseIds: id, // Check if courseId exists in courseIds array
                status: "success" // Ensure the order is successful
            });
            return !!order;
        });
    }
    courseExist(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                console.error("Invalid ObjectId format for user ID:", userId);
                return null;
            }
            const studentId = new mongoose_1.default.Types.ObjectId(userId);
            let cart = yield cartModel_1.Cart.findOne({ userId: studentId });
            if (!cart) {
                return false;
            }
            if (cart.items.some(item => item.courseId.toString() === id)) {
                return true;
            }
            return false;
        });
    }
    addToCart(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    console.error("Invalid ObjectId format for course ID:", id);
                    return null;
                }
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    console.error("Invalid ObjectId format for user ID:", userId);
                    return null;
                }
                const courseId = new mongoose_1.default.Types.ObjectId(id);
                const studentId = new mongoose_1.default.Types.ObjectId(userId);
                const course = yield courseModel_1.Course.findOne({ _id: courseId, status: "listed" }).lean().exec();
                if (!course) {
                    console.error("Course not found or not listed:", id);
                    return null;
                }
                let cart = yield cartModel_1.Cart.findOne({ userId: studentId });
                if (!cart) {
                    cart = new cartModel_1.Cart({ userId: studentId, items: [], totalPrice: 0 });
                }
                cart.items.push({ courseId, price: course.price });
                yield cart.save();
                return true;
            }
            catch (error) {
                console.log("Error adding course to cart:", error);
                throw error;
            }
        });
    }
    getCart(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield cartModel_1.Cart.findOne({ userId: studentId, status: 'active' });
            if (!cart) {
                return null;
            }
            const courseIds = cart.items.map(item => item.courseId);
            const courses = yield courseModel_1.Course.find({ _id: { $in: courseIds } });
            const itemsWithDetails = cart.items.map(item => {
                const course = courses.find(c => c._id.toString() === item.courseId.toString());
                return {
                    courseId: item.courseId.toString(),
                    price: item.price,
                    courseTitle: course ? course.title : "Unknown Course",
                    courseSubtitle: course ? course.subtitle : "No description",
                    courseDuration: course ? (course.totalDuration || 0) : 0,
                    courseLectures: course ? (course.totalLectures || 0) : 0,
                    courseImage: course ? course.imageThumbnail : "https://via.placeholder.com/300x200"
                };
            });
            const enrichedCart = {
                userId: cart.userId.toString(),
                items: itemsWithDetails,
                totalPrice: cart.totalPrice,
                status: cart.status,
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt,
                _id: cart._id.toString(),
            };
            return enrichedCart;
        });
    }
    removeItem(id, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield cartModel_1.Cart.findOne({ userId: studentId });
                if (!cart) {
                    return null;
                }
                const updatedItems = cart.items.filter(item => item.courseId.toString() !== id);
                const updatedTotalPrice = updatedItems.reduce((total, item) => total + item.price, 0);
                yield cartModel_1.Cart.updateOne({ userId: studentId }, {
                    items: updatedItems,
                    totalPrice: updatedTotalPrice
                });
                return true;
            }
            catch (error) {
                console.error("Error removing item from cart:", error);
                return null;
            }
        });
    }
    createOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const existing = yield orderModel_1.Order.findOne({
                    userId: orderData.userId,
                    courseIds: { $in: orderData.courseIds },
                    status: "pending",
                    expireAt: { $gt: new Date() }
                }, null, { session });
                if (existing) {
                    yield session.abortTransaction();
                    session.endSession();
                    return existing;
                }
                // Step 2: create new
                const newOrder = new orderModel_1.Order(orderData);
                const savedOrder = yield newOrder.save({ session });
                yield session.commitTransaction();
                session.endSession();
                return savedOrder;
            }
            catch (err) {
                yield session.abortTransaction();
                session.endSession();
                console.error("Error creating order:", err);
                return null;
            }
        });
    }
    findPendingOrder(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const order = yield orderModel_1.Order.findOne({
                userId: new mongoose_1.Types.ObjectId(studentId),
                courseIds: new mongoose_1.Types.ObjectId(courseId),
                status: "pending",
                expireAt: { $gt: now }
            });
            return order || null;
        });
    }
    updateByOrderId(razorpay_order_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedOrder = yield orderModel_1.Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { $set: { status: status } }, { new: true });
                if (!updatedOrder) {
                    console.error("❌ No order found for razorpay_order_id:", razorpay_order_id);
                    console.error("Order status not updated:");
                    return null;
                }
                if (status === 'success' && updatedOrder.courseIds && updatedOrder.courseIds.length > 0) {
                    try {
                        for (const courseId of updatedOrder.courseIds) {
                            const existingProgress = yield progress_model_1.Progress.findOne({
                                studentId: updatedOrder.userId,
                                courseId: courseId
                            });
                            if (!existingProgress) {
                                const newProgress = new progress_model_1.Progress({
                                    studentId: updatedOrder.userId,
                                    courseId: courseId,
                                    completedLectures: [],
                                    progressPercentage: 0,
                                    isCompleted: false,
                                    startDate: new Date()
                                });
                                yield newProgress.save();
                            }
                        }
                    }
                    catch (error) {
                        console.error("Error initializing progress:", error);
                    }
                    const courses = yield courseModel_1.Course.find({
                        _id: { $in: updatedOrder.courseIds }
                    }).select('tutorId price title');
                    const numberOfCoursesPurchased = updatedOrder.courseIds.length;
                    yield studentModel_1.Student.findByIdAndUpdate(updatedOrder.userId, { $inc: { enrolledCourseCount: numberOfCoursesPurchased } }, { new: true });
                    for (const course of courses) {
                        yield courseModel_1.Course.findByIdAndUpdate(course._id, { $addToSet: { purchasedStudents: updatedOrder.userId } }, { new: true });
                        if (course.tutorId) {
                            let tutorWallet = yield walletModel_1.TutorWallet.findOne({ tutorId: course.tutorId });
                            if (!tutorWallet) {
                                tutorWallet = new walletModel_1.TutorWallet({
                                    tutorId: course.tutorId,
                                    balance: 0,
                                    totalEarnings: 0,
                                    totalWithdrawn: 0,
                                    transactions: []
                                });
                            }
                            const transaction = {
                                amount: course.price,
                                type: 'credit',
                                description: `Course sale: ${course.title}`,
                                date: new Date(),
                                studentId: updatedOrder.userId,
                                referenceId: updatedOrder._id
                            };
                            tutorWallet.balance += course.price;
                            tutorWallet.totalEarnings += course.price;
                            tutorWallet.transactions.push(transaction);
                            yield tutorWallet.save();
                        }
                    }
                    yield cartModel_1.Cart.findOneAndUpdate({ userId: updatedOrder.userId }, { $set: { items: [], totalPrice: 0 } }, { new: true });
                }
                return updatedOrder ? updatedOrder.status : null;
            }
            catch (error) {
                console.error("Error updating order:", error);
                return null;
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield categoryModel_1.Category.find();
            return categories;
        });
    }
    getCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const courses = yield courseModel_1.Course.find({ status: "listed" }).sort({ createAt: -1 }).skip(skip).limit(limit).exec();
                const totalRecord = yield courseModel_1.Course.countDocuments();
                return { courses, totalRecord };
            }
            catch (error) {
                console.log("Error while retrieving courses");
                return null;
            }
        });
    }
    searchCourse(query, page, limit, category, priceRange, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const filter = {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } },
                        { subtitle: { $regex: query, $options: 'i' } },
                    ],
                    status: "listed",
                };
                if (category && category.toLowerCase() !== "all") {
                    const categoryDoc = yield categoryModel_1.Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
                    if (categoryDoc) {
                        filter.category = categoryDoc._id;
                        console.log("Found category _id:", categoryDoc._id);
                    }
                    else {
                        console.log(`No category found with name: ${category}`);
                        return { data: [], totalRecord: 0 };
                    }
                }
                if (priceRange && (priceRange[0] > 0 || priceRange[1] < 5000)) {
                    filter.price = { $gte: priceRange[0], $lte: priceRange[1] };
                }
                let sortObj = { createdAt: -1 };
                if (sortOrder === 'asc' || sortOrder === 'desc') {
                    sortObj = { title: sortOrder === 'asc' ? 1 : -1 };
                }
                const courses = yield courseModel_1.Course.find(filter, { _id: 1, title: 1, price: 1, imageThumbnail: 1, category: 1, createdAt: 1, purchasedStudents: 1 })
                    .populate('category', 'name')
                    .sort(sortObj)
                    .skip(skip)
                    .limit(limit)
                    .exec();
                // Validate courses array
                if (!courses || courses.length === 0) {
                    return { data: [], totalRecord: 0 };
                }
                const totalRecord = yield courseModel_1.Course.countDocuments(filter);
                const typedCourses = courses;
                return { data: typedCourses, totalRecord };
            }
            catch (error) {
                console.error('Error searching courses:', error);
                return null;
            }
        });
    }
    getPurchasedCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield orderModel_1.Order.find({ userId, status: "success" }).select("courseIds");
                if (!orders || orders.length === 0)
                    return null;
                const courseIds = orders.map(order => order.courseIds).flat();
                if (courseIds.length === 0)
                    return null;
                const purchasedCourses = yield courseModel_1.Course.find({ _id: { $in: courseIds } });
                return purchasedCourses;
            }
            catch (error) {
                console.error("Error fetching purchased courses:", error);
                return null;
            }
        });
    }
    getCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.Course.findOne({ _id: id })
                    .populate('tutorId', 'username')
                    .lean();
                return course;
            }
            catch (error) {
                console.log("Error while getting Course details");
                return null;
            }
        });
    }
    getTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield tutorModel_1.Tutor.findOne({ _id: id });
                return tutor;
            }
            catch (error) {
                return null;
            }
        });
    }
    getSections(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sections = yield sectionModel_1.Section.find({ courseId: id });
                return sections;
            }
            catch (error) {
                console.log("Error while getting Sections");
                return null;
            }
        });
    }
    getLectures(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lectures = yield lectureModel_1.Lecture.find({ sectionId: id });
                return lectures;
            }
            catch (error) {
                console.log("Error while retrieving Sections ");
                return null;
            }
        });
    }
    findById(lectureId) {
        return __awaiter(this, void 0, void 0, function* () {
            return lectureModel_1.Lecture.findById(lectureId).exec();
        });
    }
    getSubscription() {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriptions = yield subscriptionModel_1.default.find({ status: true });
            return subscriptions !== null && subscriptions !== void 0 ? subscriptions : null;
        });
    }
    isValidPlan(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValid = yield SubscriptionPurchased_1.SubscriptionPurchased.findOne({
                userId: studentId,
                endDate: { $gte: new Date() }
            });
            return !!isValid;
        });
    }
    findPendingSubscriptionOrder(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            const subscription = yield SubscriptionPurchased_1.SubscriptionPurchased.findOne({
                userId: studentId,
                status: 'pending',
                createdAt: { $gte: fiveMinutesAgo }
            });
            if (!subscription)
                return null;
            return subscription;
        });
    }
    createSubscriptionOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            try {
                session.startTransaction();
                if (!orderData.status || orderData.status === "pending") {
                    orderData.expireAt = new Date(Date.now() + 5 * 60 * 1000); // 10 minutes
                }
                const existingOrder = yield SubscriptionPurchased_1.SubscriptionPurchased.findOne({
                    userId: orderData.userId,
                    planId: orderData.planId,
                    status: "pending",
                }, null, { session });
                if (existingOrder) {
                    throw new Error("You already have a pending subscription for this plan.");
                }
                const order = new SubscriptionPurchased_1.SubscriptionPurchased(orderData);
                const savedOrder = yield order.save({ session });
                yield session.commitTransaction();
                session.endSession();
                return savedOrder;
            }
            catch (error) {
                yield session.abortTransaction();
                session.endSession();
                console.error("Error creating subscription order:", error);
                return null;
            }
        });
    }
    findByOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield SubscriptionPurchased_1.SubscriptionPurchased.findOne({ orderId });
            return order;
        });
    }
    findPlanById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield subscriptionModel_1.default.findById({ _id });
            return plan;
        });
    }
    updateSubscriptionByOrderId(orderId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const updatedOrder = yield SubscriptionPurchased_1.SubscriptionPurchased.findOneAndUpdate({ orderId: orderId }, data, { new: true });
            if (updatedOrder && data.paymentStatus === 'paid' && ((_a = data.paymentDetails) === null || _a === void 0 ? void 0 : _a.paymentAmount)) {
                try {
                    let adminWallet = yield adminwallet_1.AdminWallet.findOne({ email: process.env.ADMIN_MAIL });
                    if (!adminWallet) {
                        adminWallet = new adminwallet_1.AdminWallet({
                            email: process.env.ADMIN_MAIL,
                            balance: 0,
                            totalRevenue: 0,
                            totalOutflow: 0,
                            transactions: []
                        });
                    }
                    const amount = (data.paymentDetails.paymentAmount) / 100;
                    const transaction = {
                        amount: amount,
                        type: 'credit',
                        description: `Subscription payment received for order: ${orderId}`,
                        date: new Date(),
                        relatedUserId: updatedOrder.userId || undefined,
                        userType: 'Student',
                        referenceId: updatedOrder._id
                    };
                    adminWallet.balance += amount;
                    adminWallet.totalRevenue += amount;
                    adminWallet.transactions.push(transaction);
                    adminWallet.lastTransactionDate = new Date();
                    // Save the admin wallet
                    yield adminWallet.save();
                    console.log(`Added ${amount} to admin wallet for subscription payment`);
                }
                catch (error) {
                    console.error("Error updating admin wallet:", error);
                }
            }
            return updatedOrder ? updatedOrder.paymentStatus : null;
        });
    }
    getReviews(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield review_model_1.Review.find({ courseId: id, isVisible: true })
                    .populate('userId', 'username')
                    .sort({ createdAt: -1 })
                    .lean();
                return reviews.length > 0 ? reviews : [];
            }
            catch (error) {
                console.error('Error fetching reviews:', error);
                return null;
            }
        });
    }
    createReview(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newReview = yield review_model_1.Review.create({
                    courseId: new mongoose_1.Types.ObjectId(formData.courseId),
                    userId: new mongoose_1.Types.ObjectId(formData.userId),
                    rating: formData.rating,
                    review: formData.review,
                });
                const courseReviews = yield review_model_1.Review.find({ courseId: formData.courseId });
                const totalReviews = courseReviews.length;
                const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0);
                const avgRating = parseFloat((totalRating / totalReviews).toFixed(1));
                yield courseModel_1.Course.findByIdAndUpdate(formData.courseId, {
                    avgRating,
                    totalReviews,
                });
                const populatedReview = yield review_model_1.Review.findById(newReview._id)
                    .populate('userId', 'username')
                    .lean();
                return populatedReview !== null && populatedReview !== void 0 ? populatedReview : null;
            }
            catch (error) {
                console.error('Error creating review:', error);
                return null;
            }
        });
    }
    getProgress(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield progress_model_1.Progress.findOne({ courseId, studentId: userId });
            return progress !== null && progress !== void 0 ? progress : null;
        });
    }
    addLectureToProgress(userId, courseId, lectureId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const progress = yield progress_model_1.Progress.findOne({
                    studentId: new mongoose_1.Types.ObjectId(userId),
                    courseId: new mongoose_1.Types.ObjectId(courseId)
                });
                if (!progress) {
                    console.error(`Progress not found for user ${userId} and course ${courseId}`);
                    return null;
                }
                const lectureObjectId = new mongoose_1.Types.ObjectId(lectureId);
                if (!progress.completedLectures.includes(lectureObjectId)) {
                    progress.completedLectures.push(lectureObjectId);
                    progress.lastAccessedLecture = lectureObjectId;
                    progress.lastAccessDate = new Date();
                    const totalLectures = yield lectureModel_1.Lecture.countDocuments({
                        courseId: new mongoose_1.Types.ObjectId(courseId)
                    });
                    if (totalLectures > 0) {
                        progress.progressPercentage = Math.round((progress.completedLectures.length / totalLectures) * 100);
                        if (progress.completedLectures.length === totalLectures && !progress.isCompleted) {
                            progress.isCompleted = true;
                            progress.completionDate = new Date();
                        }
                    }
                    yield progress.save();
                    console.log(`Lecture ${lectureId} added to progress for user ${userId} and course ${courseId}`);
                }
                return progress;
            }
            catch (error) {
                console.error("Error adding lecture to progress:", error);
                return null;
            }
        });
    }
    editReview(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldReview = yield review_model_1.Review.findById(id);
                if (!oldReview) {
                    return null;
                }
                const courseId = oldReview.courseId;
                const updatedReview = yield review_model_1.Review.findByIdAndUpdate(id, {
                    rating: formData.rating,
                    review: formData.review
                }, { new: true });
                if (!updatedReview) {
                    return null;
                }
                const allCourseReviews = yield review_model_1.Review.find({ courseId });
                let newAvgRating = 0;
                if (allCourseReviews.length > 0) {
                    const totalRating = allCourseReviews.reduce((sum, review) => sum + review.rating, 0);
                    newAvgRating = totalRating / allCourseReviews.length;
                }
                yield courseModel_1.Course.findByIdAndUpdate(courseId, {
                    avgRating: newAvgRating
                });
                return updatedReview;
            }
            catch (error) {
                console.error("Error while editing review", error);
                return null;
            }
        });
    }
    deleteReview(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield review_model_1.Review.findById(id);
                if (!review) {
                    return false;
                }
                const courseId = review.courseId;
                const deletedReview = yield review_model_1.Review.findByIdAndDelete(id);
                if (!deletedReview) {
                    return false;
                }
                const remainingReviews = yield review_model_1.Review.find({ courseId });
                let newAvgRating = 0;
                if (remainingReviews.length > 0) {
                    const totalRating = remainingReviews.reduce((sum, review) => sum + review.rating, 0);
                    newAvgRating = totalRating / remainingReviews.length;
                }
                yield courseModel_1.Course.findByIdAndUpdate(courseId, {
                    totalReviews: remainingReviews.length,
                    avgRating: newAvgRating
                });
                return true;
            }
            catch (error) {
                console.error("Error while deleting review", error);
                return null;
            }
        });
    }
    getWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("userId in getWishlist", userId);
                const wishlist = yield wishlist_model_1.Wishlist.findOne({ userId })
                    .populate("items.courseId")
                    .exec();
                if (!wishlist)
                    return [];
                const courses = wishlist.items.map(item => item.courseId);
                const wishlistedCourses = courseModel_1.Course.find({ _id: { $in: courses } });
                return wishlistedCourses;
            }
            catch (error) {
                console.error("Error fetching wishlist:", error);
                return null;
            }
        });
    }
    addToWishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("userId in addToWishlist", userId);
                const wishlist = yield wishlist_model_1.Wishlist.findOne({ userId });
                if (!wishlist) {
                    const newWishlist = new wishlist_model_1.Wishlist({
                        userId,
                        items: [{ courseId }]
                    });
                    yield newWishlist.save();
                }
                else {
                    const courseExists = wishlist.items.some(item => item.courseId.toString() === courseId);
                    if (!courseExists) {
                        wishlist.items.push({ courseId: new mongoose_1.Types.ObjectId(courseId) });
                        yield wishlist.save();
                    }
                }
                return true;
            }
            catch (error) {
                console.error("Error adding to wishlist:", error);
                return null;
            }
        });
    }
    isInWishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wishlist = yield wishlist_model_1.Wishlist.findOne({ userId });
                console.log("wishlist in isInWishlist", wishlist);
                if (!wishlist)
                    return false;
                return wishlist.items.some(item => item.courseId.toString() === courseId);
            }
            catch (error) {
                console.error("Error checking wishlist:", error);
                return null;
            }
        });
    }
    removeFromWishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wishlist = yield wishlist_model_1.Wishlist.findOne({ userId });
                if (!wishlist) {
                    console.error("Wishlist not found for user:", userId);
                    return null;
                }
                const updatedItems = wishlist.items.filter(item => item.courseId.toString() !== courseId);
                yield wishlist_model_1.Wishlist.updateOne({ userId }, { items: updatedItems });
                return true;
            }
            catch (error) {
                console.error("Error removing from wishlist:", error);
                return null;
            }
        });
    }
}
exports.default = StudentCourseRepository;
