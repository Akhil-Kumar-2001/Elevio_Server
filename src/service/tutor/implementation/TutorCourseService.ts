import { ICategory } from "../../../model/category/categoryModel";
import { ICourse } from "../../../model/course/courseModel";
import { ILecture } from "../../../model/lecture/lectureModel";
import { ISection } from "../../../model/section/sectionModel";
import ITutorCourseRepository from "../../../repository/tutor/ITutorCourseRepository";
import { CourseData, ILectureData, ISectionData } from "../../../Types/basicTypes";
import { CourseResponseDataType } from "../../../Types/CategoryReturnType";
import ITutorCourseService from "../ITutorCourseService";
import s3 from '../../../Config/awsConfig';
import { INotification } from "../../../model/notification/notification.Model";

class TutorCourseService implements ITutorCourseService{

    private _tutorProfileRepository:ITutorCourseRepository;
    constructor(tutorProfileRepository:ITutorCourseRepository){
        this._tutorProfileRepository = tutorProfileRepository
    }

    async getCategories():Promise<ICategory[] | null> {
            const categories = await this._tutorProfileRepository.getCategories();
            return categories
        }

    async createCourse(courseData: CourseData): Promise<boolean | null> {
        const response = await this._tutorProfileRepository.createCourse(courseData);
        return response
    }

    async getCourses(tutorId:string,page: number, limit: number): Promise<CourseResponseDataType | null> {
        const response = await this._tutorProfileRepository.getCourses(tutorId,page,limit);
        return response;
    }

    async getCourseDetails(id:string):Promise<ICourse | null> {
        const response = await this._tutorProfileRepository.getCourseDetails(id);
        return response;
    }

    async editCourse(id: string, editedCourse: ICourse): Promise<ICourse | null> {
        const response = await this._tutorProfileRepository.editCourse(id,editedCourse);
        return response
    }

    async createSection(id: string,sectionData:ISectionData): Promise<ISection | null> {
        const response = await this._tutorProfileRepository.createSection(id,sectionData);
        return response
    }

    async createLecture(data: ILectureData): Promise<ILecture | null> {
        const response = await this._tutorProfileRepository.createLecture(data);
        return response
    }

    async getSections(id:string):Promise<ISection[] | null > {
        const response = await this._tutorProfileRepository.getSections(id);
        return response
    }

    async getLectures(id:string):Promise<ILecture[] | null > {
        const response = await this._tutorProfileRepository.getLectures(id);
        return response
    }

    async editLecture(id: string, title: string): Promise<ILecture | null> {
        const response = await this._tutorProfileRepository.editLecture(id,title);
       
        return response;
    }
    async deleteLecture(id: string): Promise<boolean | null> {
        const response = await this._tutorProfileRepository.deleteLecture(id);
        return response;
    }

    async editSection(id: string, data: ISectionData): Promise<ISection | null> {
        const response = await this._tutorProfileRepository.editSection(id,data);
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
            const videoUrl = await this._tutorProfileRepository.uploadLectureVideo(lectureId, videoFile);
            if (!videoUrl) {
                throw new Error('Failed to upload video or update lecture');
            }
            return videoUrl;
        } catch (error) {
            console.error('Error uploading video to S3:', error);
            throw new Error('Failed to upload video to S3');
        }
    }

    async applyReview(courseId:string): Promise<boolean | null> {
        const response = await this._tutorProfileRepository.applyReview(courseId);
        return response
    }

    async getNotifications(receiverId: string): Promise<INotification[] | null> {
        const response = await this._tutorProfileRepository.getNotifications(receiverId);
        return response;
    }

    async readNotifications(id: string): Promise<boolean | null> {
        const response = await this._tutorProfileRepository.readNotifications(id);
        return response;
    }
}

export default TutorCourseService