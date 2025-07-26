import { ICourse } from "../../../model/course/courseModel";
import ITutorCourseRepository from "../../../repository/tutor/ITutorCourseRepository";
import { CourseData, ILectureData, ISectionData } from "../../../Types/basicTypes";
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

    async createCourse(courseData: CourseData): Promise<boolean | null> {
        const response = await this._tutorCourseRepository.createCourse(courseData);
        return response
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

    async editCourse(id: string, editedCourse: ICourse): Promise<ICourseDto | null> {
        const response = await this._tutorCourseRepository.editCourse(id, editedCourse);
        if (!response) return null;
        const dto = mapCourseToDto(response);
        return dto;
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