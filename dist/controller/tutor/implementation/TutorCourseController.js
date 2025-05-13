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
class TutorCourseController {
    constructor(tutorCourseService) {
        this._tutorCourseService = tutorCourseService;
    }
    getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._tutorCourseService.getCategories();
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Categories retrieved Successfully", data: response });
                }
            }
            catch (error) {
                console.log("Error while retrieving categories:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    createCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseData = req.body;
                const response = yield this._tutorCourseService.createCourse(courseData);
                if (!response) {
                    res.status(statusCode_1.STATUS_CODES.CONFLICT).json({ success: false, message: "course alredy existed", data: null });
                }
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, message: "Course created Successfully", data: response });
                }
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
                const limit = parseInt(req.query.limit) || 5;
                const { tutorId } = req.query;
                if (!tutorId) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Tutor ID is required" });
                    return;
                }
                const response = yield this._tutorCourseService.getCourses(tutorId, page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Courses retrieved successfully", data: response });
            }
            catch (error) {
                console.log("Error fetching courses", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error fetching Courses" });
            }
        });
    }
    getCourseDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.id;
                const response = yield this._tutorCourseService.getCourseDetails(id);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Course details retrieved successfully", data: response });
            }
            catch (error) {
                console.log("Error fetching courses", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error fetching Course details" });
            }
        });
    }
    editCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, editedCourse } = req.body;
                const response = this._tutorCourseService.editCourse(id, editedCourse);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Course details updated successfully", data: response });
            }
            catch (error) {
                console.log("Error editing course details", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error editing Course details" });
            }
        });
    }
    createSection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, sectionData } = req.body;
                // Log the raw id to debug
                console.log("Raw ID received:", id);
                // Extract the courseId if id is an object
                const courseId = typeof id === 'string' ? id : id === null || id === void 0 ? void 0 : id.id;
                console.log("this is course id:===>>", courseId);
                console.log("this is the section data ===>", sectionData);
                if (!courseId) {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({
                        success: false,
                        message: "Course id is required to create section in backend",
                        data: null,
                    });
                    return;
                }
                const response = yield this._tutorCourseService.createSection(courseId, sectionData);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.CREATED).json({
                        success: true,
                        message: "Section created Successfully",
                        data: response,
                    });
                }
                else {
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({
                        success: false,
                        message: "Course not found",
                        data: null,
                    });
                }
            }
            catch (error) {
                console.log("Error while creating the Section", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Error while creating Section",
                });
            }
        });
    }
    createLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data) {
                    console.log("🚨 No data received from frontend");
                    res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND, data: null });
                    return;
                }
                const response = yield this._tutorCourseService.createLecture(data);
                if (!response) {
                    res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Failed to create lecture" });
                    return;
                }
                res.status(statusCode_1.STATUS_CODES.CREATED).json({
                    success: true,
                    message: "Lecture created Successfully",
                    data: response,
                });
            }
            catch (error) {
                console.log("🚨 Error in controller:", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while creating Lecture" });
            }
        });
    }
    getSections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.id;
                const response = yield this._tutorCourseService.getSections(id);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Section retrieved successfully", data: response });
            }
            catch (error) {
                console.log("Error while fetching Sections");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Sections" });
            }
        });
    }
    getLectures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.id;
                const response = yield this._tutorCourseService.getLectures(id);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Lectures retrieved successfully", data: response });
            }
            catch (error) {
                console.log("Error while fetching Lectures");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Lectures" });
            }
        });
    }
    editLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let title = req.body.title;
                let id = req.params.id;
                console.log(title, id);
                const response = yield this._tutorCourseService.editLecture(id, title);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Lecure updated successfully", data: response });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this._tutorCourseService.deleteLecture(id);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Lecture deleted successfully", data: response });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editSection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = req.body;
                const response = yield this._tutorCourseService.editSection(id, data);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Section updated successfully", data: response });
            }
            catch (error) {
                console.log("Error while editing Section");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while editing section" });
            }
        });
    }
    uploadLectureVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lectureId = req.body.lectureId;
                const videoFile = req.file; // File uploaded via multer
                if (!lectureId || !videoFile) {
                    res.status(400).json({ message: 'lectureId and video file are required' });
                    return;
                }
                const videoUrl = yield this._tutorCourseService.uploadLectureVideo(lectureId, videoFile);
                res.status(200).json({ videoUrl });
            }
            catch (error) {
                console.error('Error in uploadLectureVideo:', error);
                res.status(500).json({ message: 'Failed to upload video' });
            }
        });
    }
    applyReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.body;
                let response = yield this._tutorCourseService.applyReview(courseId);
                if (response) {
                    res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Apply for Course Review Successfully", data: null });
                }
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const receiverId = req.userId;
                const response = yield this._tutorCourseService.getNotifications(receiverId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Notifications retrieved Successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    readNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log("notification id", id);
                const response = yield this._tutorCourseService.readNotifications(id);
                ;
                console.log("response after read notification in the controller", response);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Notifications read Successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const response = yield this._tutorCourseService.getStudents(tutorId, page, limit);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Students retrieved Successfully", data: response });
            }
            catch (error) {
                console.log("Error while fetching students", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    getCoursePreview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const response = yield this._tutorCourseService.getCoursePreview(courseId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Course details retrieved successfully", data: response });
            }
            catch (error) {
                console.log("Error while fetching Course Preview");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Course Preview" });
            }
        });
    }
    getSectionsPreview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const response = yield this._tutorCourseService.getSectionsPreview(courseId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Sections details retrieved successfully", data: response });
            }
            catch (error) {
                console.log("Error while fetching Sections");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Sections" });
            }
        });
    }
    getLecturesPreview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sectionId } = req.params;
                const response = yield this._tutorCourseService.getLecturesPreview(sectionId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Lecture details retrieved successfully", data: response });
            }
            catch (error) {
                console.log("Error while fetching Lecture Preview");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Lecture Preview" });
            }
        });
    }
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const response = yield this._tutorCourseService.getReviews(courseId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Reviews details retrieved successfully", data: response });
            }
            catch (error) {
                console.log("Error while fetching Reviews");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Reviews" });
            }
        });
    }
    replyReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewId } = req.params;
                const { reply } = req.body;
                const response = yield this._tutorCourseService.replyReview(reviewId, reply);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Reply to review sent successfully", data: response });
            }
            catch (error) {
                console.log("Error while replying to review");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while replying to review" });
            }
        });
    }
    deleteReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewId } = req.params;
                const response = yield this._tutorCourseService.deleteReply(reviewId);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Reply deleted successfully", data: response });
            }
            catch (error) {
                console.log("Error while deleting reply");
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while deleting reply" });
            }
        });
    }
}
exports.default = TutorCourseController;
