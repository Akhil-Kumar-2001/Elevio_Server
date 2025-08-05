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
const categoryMapper_1 = require("../../../mapper/category/categoryMapper");
const courseMapper_1 = require("../../../mapper/course/courseMapper");
const sectionMapper_1 = require("../../../mapper/section/sectionMapper");
const lectureMapper_1 = require("../../../mapper/lecture/lectureMapper");
const notificationMapper_1 = require("../../../mapper/notification/notificationMapper");
const reviewMapper_1 = require("../../../mapper/review/reviewMapper");
const statusCode_1 = require("../../../constants/statusCode");
const cloudinaryConfig_1 = __importDefault(require("../../../Config/cloudinaryConfig"));
const uuid_1 = require("uuid");
const cloudinaryUtility_1 = require("../../../utils/cloudinaryUtility");
const awsConfig_1 = __importDefault(require("../../../Config/awsConfig"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_1 = __importDefault(require("@ffmpeg-installer/ffmpeg"));
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.default.path);
class TutorCourseService {
    constructor(tutorCourseRepository) {
        this._tutorCourseRepository = tutorCourseRepository;
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this._tutorCourseRepository.getCategories();
            if (!categories)
                return null;
            const dto = (0, categoryMapper_1.mapCategoriesToDto)(categories);
            return dto;
        });
    }
    isTutorVerified(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.isTutorVerified(tutorId);
            return response;
        });
    }
    createCourseWithImage(courseData, file, tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageThumbnailId = (0, uuid_1.v4)();
            const uploadImage = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinaryConfig_1.default.uploader.upload_stream({
                        folder: 'Course-Thumbnail',
                        public_id: imageThumbnailId, // ensure our ID is used
                        resource_type: 'image',
                        format: 'png',
                        type: 'authenticated'
                    }, (error, result) => {
                        if (error || !result) {
                            reject(new Error('Image upload failed'));
                        }
                        else {
                            resolve({ url: result.secure_url, public_id: result.public_id });
                        }
                    });
                    stream.end(file.buffer);
                });
            };
            let imageUploadResult;
            try {
                imageUploadResult = yield uploadImage();
            }
            catch (_a) {
                return { success: false, message: "Failed to upload course thumbnail image", statusCode: statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR };
            }
            // Add both image URL and the unique ID to courseData
            courseData.imageThumbnail = imageUploadResult.public_id;
            courseData.imageThumbnailId = imageThumbnailId;
            courseData.tutorId = tutorId;
            courseData.price = Number(courseData.price);
            // Save the course
            const createdCourse = yield this._tutorCourseRepository.createCourse(courseData);
            console.log("response from the repository in the service", createdCourse);
            if (!createdCourse) {
                return { success: false, message: "Course already exists", statusCode: statusCode_1.STATUS_CODES.CONFLICT };
            }
            return { success: true, message: "Course created successfully", data: createdCourse };
        });
    }
    getCourses(tutorId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getCourses(tutorId, page, limit);
            if (!response)
                return null;
            const dto = (0, courseMapper_1.mapCoursesToDto)(response.courses);
            return { data: dto, totalRecord: response.totalRecord };
        });
    }
    getCourseDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getCourseDetails(id);
            if (!response)
                return null;
            if (response.imageThumbnail) {
                response.imageThumbnail = (0, cloudinaryUtility_1.getSignedImageUrl)(response.imageThumbnail);
            }
            const dto = (0, courseMapper_1.mapCourseCategoryToDto)(response);
            return dto;
        });
    }
    editCourseWithImage(id, fields, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                return { success: false, message: "Course ID required", statusCode: statusCode_1.STATUS_CODES.BAD_REQUEST };
            }
            // Clean the fields: form-data always sends all fields as string, so adjust as needed:
            let updatedFields = Object.assign({}, fields);
            if (updatedFields.price)
                updatedFields.price = Number(updatedFields.price);
            if (updatedFields.category)
                updatedFields.category = updatedFields.category;
            // Only update thumbnail if new file is sent
            if (file) {
                const imageThumbnailId = (0, uuid_1.v4)();
                const imageUploadResult = yield new Promise((resolve, reject) => {
                    const stream = cloudinaryConfig_1.default.uploader.upload_stream({
                        folder: 'Course-Thumbnail',
                        public_id: imageThumbnailId,
                        resource_type: 'image',
                        format: 'png',
                        type: 'authenticated'
                    }, (error, result) => {
                        if (error || !result)
                            reject(new Error('Image upload failed'));
                        else
                            resolve({ url: result.secure_url, public_id: result.public_id });
                    });
                    stream.end(file.buffer);
                }).catch(() => null);
                if (!imageUploadResult) {
                    return { success: false, message: "Failed to upload course thumbnail", statusCode: statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR };
                }
                updatedFields.imageThumbnail = imageUploadResult.public_id;
                updatedFields.imageThumbnailId = imageThumbnailId;
            }
            // Remove file-specific fields from updatedFields form-data (e.g., don't pass undefined/non-scalar)
            // Actually update
            const updatedCourse = yield this._tutorCourseRepository.editCourse(id, updatedFields);
            if (!updatedCourse) {
                return { success: false, message: "Course not found or not updated", statusCode: statusCode_1.STATUS_CODES.NOT_FOUND };
            }
            // Optionally do mapping to DTO if needed
            const dto = (0, courseMapper_1.mapCourseToDto)(updatedCourse);
            return { success: true, message: "Course details updated successfully", data: dto };
        });
    }
    createSection(id, sectionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.createSection(id, sectionData);
            if (!response)
                return null;
            const dto = (0, sectionMapper_1.MapToSectionDto)(response);
            return dto;
        });
    }
    createLecture(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.createLecture(data);
            if (!response)
                return null;
            const dto = (0, lectureMapper_1.mapLectureToDto)(response);
            return dto;
        });
    }
    getSections(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getSections(id);
            if (!response)
                return null;
            const dto = (0, sectionMapper_1.MapToSectionsDto)(response);
            return dto;
        });
    }
    getLectures(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lectures = yield this._tutorCourseRepository.getLectures(id);
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
    editLecture(id, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.editLecture(id, title);
            if (!response)
                return null;
            const dto = (0, lectureMapper_1.mapLectureToDto)(response);
            return dto;
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
            if (!response)
                return null;
            const dto = (0, sectionMapper_1.MapToSectionDto)(response);
            return dto;
        });
    }
    /**
     * Helper to get video duration (in seconds) using ffmpeg
     */
    getVideoDuration(filePath) {
        return new Promise((resolve, reject) => {
            fluent_ffmpeg_1.default.ffprobe(filePath, (err, metadata) => {
                if (err)
                    reject(err);
                else
                    resolve(Math.round(metadata.format.duration || 0));
            });
        });
    }
    /**
     * Upload a lecture video.
     * It will:
     * - Save the video temporarily to disk
     * - Calculate duration with ffprobe
     * - Upload video to S3
     * - Update lecture DB with videoKey and duration
     * - Remove temporary file
     */
    uploadLectureVideo(lectureId, videoFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = `${lectureId}-${Date.now()}-${videoFile.originalname}`;
            const tempFilePath = path_1.default.join("/tmp", fileName);
            const videoKey = `lectures/${fileName}`;
            try {
                // Save file temporarily on disk
                yield fs_1.default.promises.writeFile(tempFilePath, videoFile.buffer);
                // Calculate video duration
                const duration = yield this.getVideoDuration(tempFilePath);
                // Upload the file to S3 (private by default)
                yield awsConfig_1.default.upload({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: videoKey,
                    Body: videoFile.buffer,
                    ContentType: videoFile.mimetype,
                }).promise();
                // Clean up temp file
                yield fs_1.default.promises.unlink(tempFilePath);
                // Update DB with videoKey and duration
                const updatedLecture = yield this._tutorCourseRepository.updateVideoKeyAndDuration(lectureId, videoKey, duration);
                if (!updatedLecture) {
                    throw new Error("Lecture not found or failed to update");
                }
                return videoKey;
            }
            catch (error) {
                // Attempt to remove the temp file if exists on failure
                try {
                    yield fs_1.default.promises.unlink(tempFilePath);
                }
                catch (_a) { }
                console.error("Error in uploadLectureVideo:", error);
                throw error;
            }
        });
    }
    /**
     * Generate signed URL from private S3 key for temporary secure access
     */
    getSignedVideoUrl(lectureId_1) {
        return __awaiter(this, arguments, void 0, function* (lectureId, expiresInSeconds = 600) {
            const lecture = yield this._tutorCourseRepository.findById(lectureId);
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
    applyReview(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.applyReview(courseId);
            return response;
        });
    }
    getNotifications(receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getNotifications(receiverId);
            if (!response)
                return null;
            const dto = (0, notificationMapper_1.mapNotificationsToDto)(response);
            return dto;
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
            if (!response)
                return null;
            const dto = (0, courseMapper_1.mapCourseToDto)(response);
            return dto;
        });
    }
    getSectionsPreview(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getSectionsPreview(courseId);
            if (!response)
                return null;
            const dto = (0, sectionMapper_1.MapToSectionsDto)(response);
            return dto;
        });
    }
    getLecturesPreview(sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lectures = yield this._tutorCourseRepository.getLecturesPreview(sectionId);
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
    getReviews(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.getReviews(courseId);
            if (!response)
                return null;
            const dto = (0, reviewMapper_1.mapReviewsReponseToDtoList)(response);
            return dto;
        });
    }
    replyReview(reviewId, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tutorCourseRepository.replyReview(reviewId, reply);
            if (!response)
                return null;
            const dto = (0, reviewMapper_1.mapReviewToDto)(response);
            return dto;
        });
    }
    deleteReply(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._tutorCourseRepository.deleteReply(reviewId);
        });
    }
}
exports.default = TutorCourseService;
