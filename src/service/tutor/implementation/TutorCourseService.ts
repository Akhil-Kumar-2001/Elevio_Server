import { ICategory } from "../../../model/category/categoryModel";
import { ICourse } from "../../../model/course/courseModel";
import { ILecture } from "../../../model/lecture/lectureModel";
import { ISection } from "../../../model/section/sectionModel";
import ITutorCourseRepository from "../../../repository/tutor/ITutorCourseRepository";
import { CourseData, ILectureData, ISectionData } from "../../../Types/basicTypes";
import { CourseResponseDataType, StudentsResponseDataType } from "../../../Types/CategoryReturnType";
import ITutorCourseService from "../ITutorCourseService";
import { INotification } from "../../../model/notification/notification.Model";
import { IReview } from "../../../model/review/review.model";

class TutorCourseService implements ITutorCourseService {

    private _tutorCourseRepository: ITutorCourseRepository;
    constructor(tutorCourseRepository: ITutorCourseRepository) {
        this._tutorCourseRepository = tutorCourseRepository
    }

    async getCategories(): Promise<ICategory[] | null> {
        const categories = await this._tutorCourseRepository.getCategories();
        return categories
    }

    async createCourse(courseData: CourseData): Promise<boolean | null> {
        const response = await this._tutorCourseRepository.createCourse(courseData);
        return response
    }

    async getCourses(tutorId: string, page: number, limit: number): Promise<CourseResponseDataType | null> {
        const response = await this._tutorCourseRepository.getCourses(tutorId, page, limit);
        return response;
    }

    async getCourseDetails(id: string): Promise<ICourse | null> {
        const response = await this._tutorCourseRepository.getCourseDetails(id);
        return response;
    }

    async editCourse(id: string, editedCourse: ICourse): Promise<ICourse | null> {
        const response = await this._tutorCourseRepository.editCourse(id, editedCourse);
        return response
    }

    async createSection(id: string, sectionData: ISectionData): Promise<ISection | null> {
        const response = await this._tutorCourseRepository.createSection(id, sectionData);
        return response
    }

    async createLecture(data: ILectureData): Promise<ILecture | null> {
        const response = await this._tutorCourseRepository.createLecture(data);
        return response
    }

    async getSections(id: string): Promise<ISection[] | null> {
        const response = await this._tutorCourseRepository.getSections(id);
        return response
    }

    async getLectures(id: string): Promise<ILecture[] | null> {
        const response = await this._tutorCourseRepository.getLectures(id);
        return response
    }

    async editLecture(id: string, title: string): Promise<ILecture | null> {
        const response = await this._tutorCourseRepository.editLecture(id, title);

        return response;
    }
    async deleteLecture(id: string): Promise<boolean | null> {
        const response = await this._tutorCourseRepository.deleteLecture(id);
        return response;
    }

    async editSection(id: string, data: ISectionData): Promise<ISection | null> {
        const response = await this._tutorCourseRepository.editSection(id, data);
        return response;
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

    async getNotifications(receiverId: string): Promise<INotification[] | null> {
        const response = await this._tutorCourseRepository.getNotifications(receiverId);
        return response;
    }

    async readNotifications(id: string): Promise<boolean | null> {
        const response = await this._tutorCourseRepository.readNotifications(id);
        return response;
    }

    async getStudents(tutorId: string,page:number,limit:number): Promise<StudentsResponseDataType | null> {
        const response = await this._tutorCourseRepository.getStudents(tutorId,page,limit);
        return response;
        
    }

    async getCoursePreview(courseId: string): Promise<ICourse | null> {
        const response = await this._tutorCourseRepository.getCoursePreview(courseId);
        return response;
    }

    async getSectionsPreview(courseId: string): Promise<ISection[] | null> {
        const response = await this._tutorCourseRepository.getSectionsPreview(courseId);
        return response;
    }

    async getLecturesPreview(sectionId: string): Promise<ILecture[] | null> {
        const response = await this._tutorCourseRepository.getLecturesPreview(sectionId);
        return response;
    }
    
    async getReviews(courseId: string): Promise<any | null> {
        const response = await this._tutorCourseRepository.getReviews(courseId);
        return response;
    }

    async replyReview(reviewId: string, reply: string): Promise<IReview | null> {
        return this._tutorCourseRepository.replyReview(reviewId, reply);
    }

    async deleteReply(reviewId: string): Promise<boolean | null> {
        return this._tutorCourseRepository.deleteReply(reviewId);
    }
}

export default TutorCourseService