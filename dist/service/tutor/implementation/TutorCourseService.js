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
class TutorCourseService {
    constructor(tutorCourseRepository) {
        this._tutorCourseRepository = tutorCourseRepository;
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this._tutorCourseRepository.getCategories();
            return categories;
        });
    }
    createCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.createCourse(courseData);
            return response;
        });
    }
    getCourses(tutorId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getCourses(tutorId, page, limit);
            return response;
        });
    }
    getCourseDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getCourseDetails(id);
            return response;
        });
    }
    editCourse(id, editedCourse) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.editCourse(id, editedCourse);
            return response;
        });
    }
    createSection(id, sectionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.createSection(id, sectionData);
            return response;
        });
    }
    createLecture(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.createLecture(data);
            return response;
        });
    }
    getSections(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getSections(id);
            return response;
        });
    }
    getLectures(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getLectures(id);
            return response;
        });
    }
    editLecture(id, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.editLecture(id, title);
            return response;
        });
    }
    deleteLecture(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.deleteLecture(id);
            return response;
        });
    }
    editSection(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.editSection(id, data);
            return response;
        });
    }
    uploadLectureVideo(lectureId, videoFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = `${lectureId}-${Date.now()}-${videoFile.originalname}`;
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME || 'your-bucket-name',
                Key: `lectures/${fileName}`,
                Body: videoFile.buffer,
                ContentType: videoFile.mimetype,
                ACL: 'public-read',
            };
            try {
                // Delegate the entire upload and update process to the repository
                const videoUrl = yield this._tutorCourseRepository.uploadLectureVideo(lectureId, videoFile);
                if (!videoUrl) {
                    throw new Error('Failed to upload video or update lecture');
                }
                return videoUrl;
            }
            catch (error) {
                console.error('Error uploading video to S3:', error);
                throw new Error('Failed to upload video to S3');
            }
        });
    }
    applyReview(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.applyReview(courseId);
            return response;
        });
    }
    getNotifications(receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getNotifications(receiverId);
            return response;
        });
    }
    readNotifications(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.readNotifications(id);
            return response;
        });
    }
    getStudents(tutorId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getStudents(tutorId, page, limit);
            return response;
        });
    }
    getCoursePreview(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getCoursePreview(courseId);
            return response;
        });
    }
    getSectionsPreview(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getSectionsPreview(courseId);
            return response;
        });
    }
    getLecturesPreview(sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getLecturesPreview(sectionId);
            return response;
        });
    }
    getReviews(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getReviews(courseId);
            return response;
        });
    }
    replyReview(reviewId, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._tutorCourseRepository.replyReview(reviewId, reply);
        });
    }
    deleteReply(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._tutorCourseRepository.deleteReply(reviewId);
        });
    }
}
exports.default = TutorCourseService;
