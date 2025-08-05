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
const courseModel_1 = require("../../../model/course/courseModel");
const categoryModel_1 = require("../../../model/category/categoryModel");
const sectionModel_1 = require("../../../model/section/sectionModel");
const lectureModel_1 = require("../../../model/lecture/lectureModel");
const notification_Model_1 = require("../../../model/notification/notification.Model");
const review_model_1 = require("../../../model/review/review.model");
const studentModel_1 = require("../../../model/student/studentModel");
const mongoose_1 = require("mongoose");
const tutorModel_1 = require("../../../model/tutor/tutorModel");
class TutorCourseRepository {
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield categoryModel_1.Category.find();
            return categories;
        });
    }
    isTutorVerified(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield tutorModel_1.Tutor.findOne({ _id: tutorId });
            if ((tutor === null || tutor === void 0 ? void 0 : tutor.isVerified) == "verified") {
                return true;
            }
            else {
                return false;
            }
        });
    }
    createCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCourse = yield courseModel_1.Course.findOne({ title: courseData === null || courseData === void 0 ? void 0 : courseData.title });
                if (existingCourse) {
                    return false;
                }
                else {
                    const newCourse = new courseModel_1.Course(courseData);
                    yield newCourse.save();
                    return true;
                }
            }
            catch (error) {
                console.error("Error creating course:", error);
                return null;
            }
        });
    }
    getCourses(tutorId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const courses = yield courseModel_1.Course.find({ tutorId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
                const totalRecord = yield courseModel_1.Course.find({ tutorId }).countDocuments();
                return { courses, totalRecord };
            }
            catch (error) {
                console.log("Error while retrieving courses");
                return null;
            }
        });
    }
    getCourseDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseDetails = yield courseModel_1.Course.findById(id)
                    .populate('category', 'name')
                    .lean();
                return courseDetails;
            }
            catch (error) {
                console.log("Error while retrieving course details");
                return null;
            }
        });
    }
    editCourse(id, editCourse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCourse = yield courseModel_1.Course.findByIdAndUpdate(id, { $set: editCourse }, { new: true });
                return updatedCourse;
            }
            catch (error) {
                console.log("Error while updating course details");
                return null;
            }
        });
    }
    createSection(id, sectionData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const course = yield courseModel_1.Course.findById(id);
                if (!course) {
                    console.log("Course not found for ID:", id);
                    return null;
                }
                const sectionCount = yield sectionModel_1.Section.countDocuments({ courseId: id });
                const newSection = new sectionModel_1.Section({
                    courseId: id,
                    title: sectionData.title,
                    description: sectionData.description,
                    order: sectionCount + 1,
                    totalLectures: 0,
                    totalDuration: 0,
                    isPublished: false,
                });
                yield newSection.save();
                course.totalSections = ((_a = course.totalSections) !== null && _a !== void 0 ? _a : 0) + 1;
                yield course.save();
                return newSection;
            }
            catch (error) {
                console.log("Error while creating section:", error);
                return null;
            }
        });
    }
    createLecture(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { title, courseId, sectionId } = data;
                // Check if the course and section exist
                const course = yield courseModel_1.Course.findById(courseId);
                if (!course) {
                    console.log("Course not found");
                    return null;
                }
                const sectionExists = yield sectionModel_1.Section.findById(sectionId);
                if (!sectionExists) {
                    console.log("Section not found");
                    return null;
                }
                // Get the current number of lectures in the section to determine the order
                const lectureCount = yield lectureModel_1.Lecture.countDocuments({ sectionId });
                // Create new lecture
                const newLecture = new lectureModel_1.Lecture({
                    sectionId,
                    courseId,
                    title,
                    videoUrl: "", // Placeholder; should be provided when video is uploaded
                    duration: 0, // Default value; update once video is processed
                    order: lectureCount + 1, // Order based on existing lectures
                    status: "processing",
                    isPreview: false,
                });
                yield newLecture.save();
                // Update section's total lectures count
                yield sectionModel_1.Section.findByIdAndUpdate(sectionId, {
                    $inc: { totalLectures: 1 },
                });
                course.totalLectures = ((_a = course.totalLectures) !== null && _a !== void 0 ? _a : 0) + 1;
                course.save();
                return newLecture;
            }
            catch (error) {
                console.error("Error while creating lecture:", error);
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
                console.log("Error while retrieving Sections ");
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
    editLecture(id, title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedLecture = yield lectureModel_1.Lecture.findByIdAndUpdate(id, { title }, { new: true });
                return updatedLecture;
            }
            catch (error) {
                console.log("Error updating lecture:", error);
                return null;
            }
        });
    }
    deleteLecture(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                // Find the lecture to get section and course IDs
                const deletedLecture = yield lectureModel_1.Lecture.findByIdAndDelete(id);
                if (!deletedLecture) {
                    console.log("Lecture not found for ID:", id);
                    return false;
                }
                const { sectionId, courseId, duration } = deletedLecture;
                // Update totalLectures and totalDuration in the section
                const section = yield sectionModel_1.Section.findById(sectionId);
                if (section) {
                    section.totalLectures = Math.max(((_a = section.totalLectures) !== null && _a !== void 0 ? _a : 0) - 1, 0);
                    section.totalDuration = Math.max(((_b = section.totalDuration) !== null && _b !== void 0 ? _b : 0) - duration, 0);
                    yield section.save();
                }
                // Update totalLectures and totalDuration in the course
                const course = yield courseModel_1.Course.findById(courseId);
                if (course) {
                    course.totalLectures = Math.max(((_c = course.totalLectures) !== null && _c !== void 0 ? _c : 0) - 1, 0);
                    course.totalDuration = Math.max(((_d = course.totalDuration) !== null && _d !== void 0 ? _d : 0) - duration, 0);
                    yield course.save();
                }
                return true;
            }
            catch (error) {
                console.log("Error deleting lecture:", error);
                return null;
            }
        });
    }
    editSection(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached here");
                const updatedSection = yield sectionModel_1.Section.findByIdAndUpdate(id, { $set: data }, { new: true });
                console.log(updatedSection);
                return updatedSection;
            }
            catch (error) {
                console.log("Error updating section:", error);
                return null;
            }
        });
    }
    findById(lectureId) {
        return __awaiter(this, void 0, void 0, function* () {
            return lectureModel_1.Lecture.findById(lectureId).exec();
        });
    }
    updateVideoKeyAndDuration(lectureId, videoKey, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield lectureModel_1.Lecture.findByIdAndUpdate(lectureId, {
                videoKey,
                duration,
                status: "processed",
            }, { new: true }).exec();
            console.log("response from reposittory", response);
            return response;
        });
    }
    applyReview(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCourse = yield courseModel_1.Course.findByIdAndUpdate(courseId, { status: "pending" }, { new: true });
                if (!updatedCourse) {
                    return null;
                }
                return true;
            }
            catch (error) {
                console.log("Error updating course status:", error);
                return null;
            }
        });
    }
    getNotifications(receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notification_Model_1.Notification.find({ receiverId }).sort({ createdAt: -1 });
                return notifications;
            }
            catch (error) {
                console.log("Error fetching notifications:", error);
                return null;
            }
        });
    }
    readNotifications(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield notification_Model_1.Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
                console.log("notification after read", notification);
                return notification ? true : false;
            }
            catch (error) {
                return null;
            }
        });
    }
    getStudents(tutorId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Get all courses by the tutor
                const courses = yield courseModel_1.Course.find({ tutorId }, "purchasedStudents");
                if (!courses.length)
                    return { students: [], totalRecord: 0 };
                // Step 2: Extract all student IDs from the courses
                const allStudentIds = courses.flatMap(course => course.purchasedStudents || []);
                // Step 3: Deduplicate the IDs
                const uniqueStudentIds = Array.from(new Set(allStudentIds.map(id => id.toString())))
                    .map(id => new mongoose_1.Types.ObjectId(id));
                const totalRecord = uniqueStudentIds.length;
                // Step 4: Apply pagination
                const skip = (page - 1) * limit;
                const students = yield studentModel_1.Student.find({ _id: { $in: uniqueStudentIds }, status: 1 }, "profilePicture username email role" // field projection
                )
                    .skip(skip)
                    .limit(limit);
                const formattedStudents = students.map(student => ({
                    profilePicture: student.profilePicture,
                    username: student.username,
                    email: student.email,
                    role: student.role
                }));
                return {
                    students: formattedStudents,
                    totalRecord,
                };
            }
            catch (error) {
                console.error("Error while getting students:", error);
                return null;
            }
        });
    }
    getCoursePreview(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.Course.findOne({ _id: courseId })
                    .populate('tutorId', 'username email profilePicture')
                    .populate('category', 'name');
                return course;
            }
            catch (error) {
                console.log("Error while getting Course details");
                return null;
            }
        });
    }
    getSectionsPreview(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sections = yield sectionModel_1.Section.find({ courseId });
                return sections;
            }
            catch (error) {
                console.log("Error while getting Sections");
                return null;
            }
        });
    }
    getLecturesPreview(sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lectures = yield lectureModel_1.Lecture.find({ sectionId: sectionId });
                return lectures;
            }
            catch (error) {
                console.log("Error while retrieving Sections ");
                return null;
            }
        });
    }
    getReviews(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield review_model_1.Review.find({ courseId, isVisible: true })
                    .populate('userId', 'username')
                    .sort({ createdAt: -1 })
                    .lean();
                return reviews.length > 0 ? reviews : null;
            }
            catch (error) {
                console.error('Error fetching reviews:', error);
                return null;
            }
        });
    }
    replyReview(reviewId, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedReview = yield review_model_1.Review.findByIdAndUpdate({ _id: reviewId }, { reply }, { new: true });
                return updatedReview !== null && updatedReview !== void 0 ? updatedReview : null;
            }
            catch (error) {
                console.error('Error replying to review:', error);
                return null;
            }
        });
    }
    deleteReply(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield review_model_1.Review.findByIdAndUpdate(reviewId, { $set: { reply: null } }, { new: true });
                if (!result) {
                    console.error('Review not found for ID:', reviewId);
                    return false;
                }
                return true;
            }
            catch (error) {
                console.error('Error deleting reply:', error);
                return null;
            }
        });
    }
}
exports.default = TutorCourseRepository;
