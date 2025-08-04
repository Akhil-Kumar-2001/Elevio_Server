import { ICourse } from "../../../model/course/courseModel";
import ITutorCourseRepository from "../../../repository/tutor/ITutorCourseRepository";
import { CourseData, ICourseCreateData, ICourseEditableFields, ICourseFullData, ICourseFullEditableFields, ILectureData, ISectionData, IServiceResponse } from "../../../Types/basicTypes";
import { PaginatedResponse, StudentsResponseDataType } from "../../../Types/CategoryReturnType";
import ITutorCourseService from "../ITutorCourseService";
import { ICategoryDto } from "../../../dtos/category/categoryDto";
import { mapCategoriesToDto } from "../../../mapper/category/categoryMapper";
import { mapCourseCategoryToDto, mapCoursesToDto, mapCourseToDto } from "../../../mapper/course/courseMapper";
import { ICourseCategoryDto, ICourseDto } from "../../../dtos/course/courseDto";
import { ISectionDto } from "../../../dtos/section/ISectionDto";
import { MapToSectionDto, MapToSectionsDto } from "../../../mapper/section/sectionMapper";
import { ILectureDto } from "../../../dtos/lecture/ILectureDto";
import { mapLecturesToDto, mapLectureToDto } from "../../../mapper/lecture/lectureMapper";
import { INotificationDto } from "../../../dtos/notification/notificationDto";
import { mapNotificationsToDto } from "../../../mapper/notification/notificationMapper";
import { IReviewDto, IReviewResponseDto } from "../../../dtos/review/IReviewResponseDto";
import { mapReviewsReponseToDtoList, mapReviewToDto } from "../../../mapper/review/reviewMapper";
import { STATUS_CODES } from "../../../constants/statusCode";
import cloudinary from "../../../Config/cloudinaryConfig";
import { v4 as uuidv4 } from 'uuid';


class TutorCourseService implements ITutorCourseService {

    private _tutorCourseRepository: ITutorCourseRepository;
    constructor(tutorCourseRepository: ITutorCourseRepository) {
        this._tutorCourseRepository = tutorCourseRepository
    }

    async getCategories(): Promise<ICategoryDto[] | null> {
        const categories = await this._tutorCourseRepository.getCategories();
        if (!categories) return null;
        const dto = mapCategoriesToDto(categories);
        return dto;
    }

    async isTutorVerified(tutorId: string): Promise<boolean | null> {
        const response = await this._tutorCourseRepository.isTutorVerified(tutorId);
        return response
    }

    async createCourseWithImage(courseData: ICourseFullData, file: Express.Multer.File, tutorId: string): Promise<IServiceResponse<boolean>> {

        const imageThumbnailId = uuidv4();

        const uploadImage = (): Promise<{ url: string; public_id: string }> => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'Course-Thumbnail',
                        public_id: imageThumbnailId, // ensure our ID is used
                        resource_type: 'image',
                        format: 'png'
                    },
                    (error, result) => {
                        if (error || !result) {
                            reject(new Error('Image upload failed'));
                        } else {
                            resolve({ url: result.secure_url, public_id: result.public_id });
                        }
                    }
                );
                stream.end(file.buffer);
            });
        };

        let imageUploadResult;
        try {
            imageUploadResult = await uploadImage();
        } catch {
            return { success: false, message: "Failed to upload course thumbnail image", statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR };
        }

        // Add both image URL and the unique ID to courseData
        courseData.imageThumbnail = imageUploadResult.url;
        courseData.imageThumbnailId = imageThumbnailId;
        courseData.tutorId = tutorId;
        courseData.price = Number(courseData.price);

        // Save the course
        const createdCourse = await this._tutorCourseRepository.createCourse(courseData);
        console.log("response from the repository in the service", createdCourse)

        if (!createdCourse) {
            return { success: false, message: "Course already exists", statusCode: STATUS_CODES.CONFLICT };
        }

        return { success: true, message: "Course created successfully", data: createdCourse };
    }

    async getCourses(tutorId: string, page: number, limit: number): Promise<PaginatedResponse<ICourseDto> | null> {
        const response = await this._tutorCourseRepository.getCourses(tutorId, page, limit);
        if (!response) return null;
        const dto = mapCoursesToDto(response.courses);
        return { data: dto, totalRecord: response.totalRecord };
    }

    async getCourseDetails(id: string): Promise<ICourseCategoryDto | null> {
        const response = await this._tutorCourseRepository.getCourseDetails(id);
        if (!response) return null;
        const dto = mapCourseCategoryToDto(response);
        return dto;
    }


    async editCourseWithImage(
        id: string,
        fields: ICourseEditableFields,
        file: Express.Multer.File | undefined,
    ): Promise<IServiceResponse<ICourseDto>> {
        if (!id) {
            return { success: false, message: "Course ID required", statusCode: STATUS_CODES.BAD_REQUEST };
        }
        // Optionally: fetch and authorize that tutorId matches course's real tutor...

        // Clean the fields: form-data always sends all fields as string, so adjust as needed:
        let updatedFields: ICourseFullEditableFields = { ...fields };
        if (updatedFields.price) updatedFields.price = Number(updatedFields.price);
        if (updatedFields.category) updatedFields.category = updatedFields.category;

        // Only update thumbnail if new file is sent
        if (file) {
            const imageThumbnailId = uuidv4();
            const imageUploadResult = await new Promise<{ url: string; public_id: string }>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'Course-Thumbnail',
                        public_id: imageThumbnailId,
                        resource_type: 'image',
                        format: 'png',
                    },
                    (error, result) => {
                        if (error || !result) reject(new Error('Image upload failed'));
                        else resolve({ url: result.secure_url, public_id: result.public_id });
                    }
                );
                stream.end(file.buffer);
            }).catch(() => null);

            if (!imageUploadResult) {
                return { success: false, message: "Failed to upload course thumbnail", statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR };
            }
            updatedFields.imageThumbnail = imageUploadResult.url;
            updatedFields.imageThumbnailId = imageThumbnailId;
        }

        // Remove file-specific fields from updatedFields form-data (e.g., don't pass undefined/non-scalar)
        // Actually update
        const updatedCourse = await this._tutorCourseRepository.editCourse(id, updatedFields);

        if (!updatedCourse) {
            return { success: false, message: "Course not found or not updated", statusCode: STATUS_CODES.NOT_FOUND };
        }

        // Optionally do mapping to DTO if needed
        const dto = mapCourseToDto(updatedCourse);
        return { success: true, message: "Course details updated successfully", data: dto };
    }


    async createSection(id: string, sectionData: ISectionData): Promise<ISectionDto | null> {
        const response = await this._tutorCourseRepository.createSection(id, sectionData);
        if (!response) return null;
        const dto = MapToSectionDto(response);
        return dto;
    }

    async createLecture(data: ILectureData): Promise<ILectureDto | null> {
        const response = await this._tutorCourseRepository.createLecture(data);
        if (!response) return null;
        const dto = mapLectureToDto(response);
        return dto;
    }

    async getSections(id: string): Promise<ISectionDto[] | null> {
        const response = await this._tutorCourseRepository.getSections(id);
        if (!response) return null;
        const dto = MapToSectionsDto(response);
        return dto;
    }

    async getLectures(id: string): Promise<ILectureDto[] | null> {
        const response = await this._tutorCourseRepository.getLectures(id);
        if (!response) return null;
        const dto = mapLecturesToDto(response);
        return dto;
    }

    async editLecture(id: string, title: string): Promise<ILectureDto | null> {
        const response = await this._tutorCourseRepository.editLecture(id, title);
        if (!response) return null;
        const dto = mapLectureToDto(response);
        return dto;
    }
    async deleteLecture(id: string): Promise<boolean | null> {
        const response = await this._tutorCourseRepository.deleteLecture(id);
        return response;
    }

    async editSection(id: string, data: ISectionData): Promise<ISectionDto | null> {
        const response = await this._tutorCourseRepository.editSection(id, data);
        if (!response) return null;
        const dto = MapToSectionDto(response);
        return dto;
    }

    async uploadLectureVideo(lectureId: string, videoFile: Express.Multer.File): Promise<string> {
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
            const videoUrl = await this._tutorCourseRepository.uploadLectureVideo(lectureId, videoFile);
            if (!videoUrl) {
                throw new Error('Failed to upload video or update lecture');
            }
            return videoUrl;
        } catch (error) {
            console.error('Error uploading video to S3:', error);
            throw new Error('Failed to upload video to S3');
        }
    }

    async applyReview(courseId: string): Promise<boolean | null> {
        const response = await this._tutorCourseRepository.applyReview(courseId);
        return response
    }

    async getNotifications(receiverId: string): Promise<INotificationDto[] | null> {
        const response = await this._tutorCourseRepository.getNotifications(receiverId);
        if (!response) return null;
        const dto = mapNotificationsToDto(response);
        return dto;
    }

    async readNotifications(id: string): Promise<boolean | null> {
        const response = await this._tutorCourseRepository.readNotifications(id);
        return response;
    }

    async getStudents(tutorId: string, page: number, limit: number): Promise<StudentsResponseDataType | null> {
        const response = await this._tutorCourseRepository.getStudents(tutorId, page, limit);
        return response;

    }

    async getCoursePreview(courseId: string): Promise<ICourseDto | null> {
        const response = await this._tutorCourseRepository.getCoursePreview(courseId);
        if (!response) return null;
        const dto = mapCourseToDto(response);
        return dto;
    }

    async getSectionsPreview(courseId: string): Promise<ISectionDto[] | null> {
        const response = await this._tutorCourseRepository.getSectionsPreview(courseId);
        if (!response) return null;
        const dto = MapToSectionsDto(response);
        return dto;
    }

    async getLecturesPreview(sectionId: string): Promise<ILectureDto[] | null> {
        const response = await this._tutorCourseRepository.getLecturesPreview(sectionId);
        if (!response) return null;
        const dto = mapLecturesToDto(response);
        return dto;
    }

    async getReviews(courseId: string): Promise<IReviewDto[] | null> {
        const response = await this._tutorCourseRepository.getReviews(courseId);
        if (!response) return null;
        const dto = mapReviewsReponseToDtoList(response)
        return dto
    }

    async replyReview(reviewId: string, reply: string): Promise<IReviewResponseDto | null> {
        const response = await this._tutorCourseRepository.replyReview(reviewId, reply);
        if (!response) return null;
        const dto = mapReviewToDto(response);
        return dto;
    }

    async deleteReply(reviewId: string): Promise<boolean | null> {
        return this._tutorCourseRepository.deleteReply(reviewId);
    }
}

export default TutorCourseService