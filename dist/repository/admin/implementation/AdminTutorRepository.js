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
const categoryModel_1 = require("../../../model/category/categoryModel");
const courseModel_1 = require("../../../model/course/courseModel");
const lectureModel_1 = require("../../../model/lecture/lectureModel");
const notification_Model_1 = require("../../../model/notification/notification.Model");
const sectionModel_1 = require("../../../model/section/sectionModel");
const subscriptionModel_1 = __importDefault(require("../../../model/subscription/subscriptionModel"));
const tutorModel_1 = require("../../../model/tutor/tutorModel");
const walletModel_1 = require("../../../model/wallet/walletModel");
class AdminTutorRepository {
    getPendingTutors(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const tutors = yield tutorModel_1.Tutor.find({ isVerified: "pending" })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalRecord = yield tutorModel_1.Tutor.countDocuments();
            console.log(tutors);
            return { data: tutors, totalRecord };
        });
    }
    getTutorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield tutorModel_1.Tutor.findById(id);
            return tutor;
        });
    }
    rejectTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield tutorModel_1.Tutor.findByIdAndUpdate(id, {
                    isVerified: "not_verified",
                    profile: {
                        skills: [],
                        documents: [],
                        experience: "",
                        bio: "",
                        qualification: ""
                    }
                }, { new: true });
                return tutor ? true : null;
            }
            catch (error) {
                console.error("Error rejecting tutor verification:", error);
                return null;
            }
        });
    }
    ;
    approveTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield tutorModel_1.Tutor.findByIdAndUpdate(id, { isVerified: "verified" }, { new: true });
                return tutor ? true : null;
            }
            catch (error) {
                console.error("Error approving tutor verification:", error);
                return null;
            }
        });
    }
    ;
    findCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield categoryModel_1.Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
                return !!category;
            }
            catch (error) {
                console.log("Error finding category:", error);
                return false;
            }
        });
    }
    createCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCategory = new categoryModel_1.Category({ name });
                yield newCategory.save();
                return true;
            }
            catch (error) {
                console.log("Error creating category:", error);
                return false;
            }
        });
    }
    getCategories(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const categories = yield categoryModel_1.Category.find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec();
                const totalRecord = yield categoryModel_1.Category.countDocuments();
                const categoryDtos = categories.map((category) => ({
                    _id: category._id.toString(),
                    name: category.name,
                    status: category.status,
                    createdAt: category.get('createdAt'),
                    updatedAt: category.get('updatedAt')
                }));
                return { data: categoryDtos, totalRecord };
            }
            catch (error) {
                console.log("Error while retrieving categories");
                return null;
            }
        });
    }
    blockCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoryModel_1.Category.findById(id, { status: 1 });
            const newStatus = (category === null || category === void 0 ? void 0 : category.status) === 1 ? -1 : 1;
            const updatedCategory = yield categoryModel_1.Category.findByIdAndUpdate(id, { status: newStatus }, { new: true } // Returns the updated document
            );
            if (!updatedCategory)
                return null;
            const categoryDtos = {
                _id: updatedCategory._id.toString(),
                name: updatedCategory.name,
                status: updatedCategory.status,
                createdAt: updatedCategory.get('createdAt'),
                updatedAt: updatedCategory.get('updatedAt')
            };
            return categoryDtos;
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedCategory = yield categoryModel_1.Category.findByIdAndDelete(id);
                return deletedCategory ? true : false;
            }
            catch (error) {
                console.log("Error deleting category:", error);
                return false;
            }
        });
    }
    pendingCourse(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const courses = yield courseModel_1.Course.find({ status: "pending" })
                .sort({ updatedAt: -1 })
                .skip(skip)
                .exec();
            const totalRecord = yield courseModel_1.Course.countDocuments();
            return { courses, totalRecord };
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield categoryModel_1.Category.find();
            return categories;
        });
    }
    courseDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = courseModel_1.Course.findOne({ _id: id });
            return course;
        });
    }
    getCategoryName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const category = yield categoryModel_1.Category.findOne({ _id: id });
            return (_a = category === null || category === void 0 ? void 0 : category.name) !== null && _a !== void 0 ? _a : null;
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
    findById(lectureId) {
        return __awaiter(this, void 0, void 0, function* () {
            return lectureModel_1.Lecture.findById(lectureId).exec();
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
    rejectCourse(id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.Course.findByIdAndUpdate(id, {
                    status: "rejected",
                    rejectedReason: reason
                }, { new: true });
                if (course) {
                    // Create a notification for the tutor
                    const notification = yield notification_Model_1.Notification.create({
                        receiverId: course.tutorId,
                        content: `Your course "${course.title}" has been rejected. Reason: ${reason}`,
                    });
                    return notification;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log("Error while rejecting course verification:", error);
                return null;
            }
        });
    }
    getTutorMail(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield tutorModel_1.Tutor.findOne({ _id: tutorId });
                if (!tutor) {
                    console.log("Tutor not found for ID:", tutorId);
                    return null;
                }
                const email = tutor.email;
                return email;
            }
            catch (error) {
                console.log("Error while getting email of tutor:", error);
                return null;
            }
        });
    }
    approveCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.Course.findByIdAndUpdate(id, { status: "accepted" }, { new: true });
                return course ? true : false;
            }
            catch (error) {
                console.error("Error while approving course verification:", error);
                return null;
            }
        });
    }
    getSubscription(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const subscriptions = yield subscriptionModel_1.default.find()
                    .sort({ createdAt: 1 })
                    .skip(skip)
                    .limit(limit)
                    .exec();
                const totalRecord = yield subscriptionModel_1.default.countDocuments();
                console.log("total record suscription", totalRecord);
                return { subscriptions, totalRecord };
                // return subscriptions ?? null;
            }
            catch (error) {
                console.error("Error while approving course verification:", error);
                return null;
            }
        });
    }
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a new subscription document
            const newSubscription = new subscriptionModel_1.default({
                planName: data.planName,
                duration: {
                    value: data.duration.value,
                    unit: data.duration.unit
                },
                price: data.price,
                features: data.features,
                status: data.status
            });
            // Save the subscription to the database
            yield newSubscription.save();
            return newSubscription ? true : null;
        });
    }
    editSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSubscription = yield subscriptionModel_1.default.findByIdAndUpdate(data._id, {
                    $set: {
                        planName: data.planName,
                        duration: data.duration,
                        price: data.price,
                        features: data.features,
                        status: data.status,
                        updatedAt: new Date()
                    }
                }, { new: true } // Returns the updated document
                );
                return updatedSubscription ? true : null;
            }
            catch (error) {
                console.error("Error updating subscription:", error);
                return null;
            }
        });
    }
    deleteSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield subscriptionModel_1.default.findByIdAndDelete({ _id: id });
            return response ? true : null;
        });
    }
    getTutorsWalltes(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const wallets = yield walletModel_1.TutorWallet.find()
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalRecord = yield walletModel_1.TutorWallet.countDocuments();
            return { wallets, totalRecord };
        });
    }
    getTutorsList() {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield tutorModel_1.Tutor.find();
            return tutor;
        });
    }
}
exports.default = AdminTutorRepository;
