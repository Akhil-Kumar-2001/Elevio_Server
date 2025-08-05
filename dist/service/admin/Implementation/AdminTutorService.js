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
const awsConfig_1 = __importDefault(require("../../../Config/awsConfig"));
const socketConfig_1 = require("../../../Config/socketConfig");
const categoryMapper_1 = require("../../../mapper/category/categoryMapper");
const courseMapper_1 = require("../../../mapper/course/courseMapper");
const lectureMapper_1 = require("../../../mapper/lecture/lectureMapper");
const sectionMapper_1 = require("../../../mapper/section/sectionMapper");
const subscriptionMapper_1 = require("../../../mapper/subscription/subscriptionMapper");
const tutorMapper_1 = require("../../../mapper/tutor/tutorMapper");
const tutorWalletMapper_1 = require("../../../mapper/wallet/tutorwallet/tutorWalletMapper");
const cloudinaryUtility_1 = require("../../../utils/cloudinaryUtility");
class AdminTutorService {
    constructor(adminTutorRepository) {
        this._adminTutorRepository = adminTutorRepository;
    }
    getPendingTutors(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutors = yield this._adminTutorRepository.getPendingTutors(page, limit);
            if (!tutors)
                return null;
            const dto = (0, tutorMapper_1.mapTutorsToDto)(tutors.data);
            return { data: dto, totalRecord: tutors.totalRecord };
        });
    }
    getTutorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this._adminTutorRepository.getTutorById(id);
            if (!tutor)
                return null;
            const dto = (0, tutorMapper_1.mapTutorToDto)(tutor);
            return dto;
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
            if (!response)
                return null;
            for (const course of response.courses) {
                if (course.imageThumbnail) {
                    course.imageThumbnail = (0, cloudinaryUtility_1.getSignedImageUrl)(course.imageThumbnail);
                }
            }
            const dto = (0, courseMapper_1.mapCoursesToDto)(response.courses);
            return { data: dto, totalRecord: response.totalRecord };
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this._adminTutorRepository.getCategory();
            const dto = (0, categoryMapper_1.mapCategoriesToDto)(categories);
            return dto;
        });
    }
    courseDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._adminTutorRepository.courseDetails(id);
            if (!course)
                return null;
            if (course.imageThumbnail) {
                course.imageThumbnail = (0, cloudinaryUtility_1.getSignedImageUrl)(course.imageThumbnail);
            }
            const dto = (0, courseMapper_1.mapCourseToDto)(course);
            return dto;
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
            const dto = (0, sectionMapper_1.MapToSectionsDto)(sections);
            return dto;
        });
    }
    /**
       * Generate signed URL from private S3 key for temporary secure access
       */
    getSignedVideoUrl(lectureId_1) {
        return __awaiter(this, arguments, void 0, function* (lectureId, expiresInSeconds = 600) {
            const lecture = yield this._adminTutorRepository.findById(lectureId);
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
            const lectures = yield this._adminTutorRepository.getLectures(id);
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
            if (!response)
                return null;
            const dto = (0, subscriptionMapper_1.mapSubscriptionsToDto)(response === null || response === void 0 ? void 0 : response.subscriptions);
            return { data: dto, totalRecord: response === null || response === void 0 ? void 0 : response.totalRecord };
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
            if (!wallets)
                return null;
            return (0, tutorWalletMapper_1.mapTutorWalletsToPaginatedDto)(wallets.wallets, wallets.totalRecord);
        });
    }
    getTutorsList() {
        return __awaiter(this, void 0, void 0, function* () {
            const tutors = yield this._adminTutorRepository.getTutorsList();
            const dto = (0, tutorMapper_1.mapTutorsToDto)(tutors);
            return dto;
        });
    }
}
exports.default = AdminTutorService;
