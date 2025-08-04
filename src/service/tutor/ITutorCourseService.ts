import { ICourse } from "../../model/course/courseModel"
import { ILecture } from "../../model/lecture/lectureModel"
import { ISection } from "../../model/section/sectionModel"
import { CourseData, ICourseCreateData, ICourseFullData, ILectureData, ISectionData, IServiceResponse } from "../../Types/basicTypes"
import { PaginatedResponse, StudentsResponseDataType } from "../../Types/CategoryReturnType"
import { IReview } from "../../model/review/review.model"
import { ICategoryDto } from "../../dtos/category/categoryDto"
import { ICourseCategoryDto, ICourseDto } from "../../dtos/course/courseDto"
import { ISectionDto } from "../../dtos/section/ISectionDto"
import { ILectureDto } from "../../dtos/lecture/ILectureDto"
import { INotificationDto } from "../../dtos/notification/notificationDto"
import { IReviewDto, IReviewResponseDto } from "../../dtos/review/IReviewResponseDto"

interface ITutorCourseService {
    getCategories(): Promise<ICategoryDto[] | null>
    isTutorVerified(tutorId : string): Promise<boolean | null>
    getCourses(tutorId:string,page:number,limit:number): Promise<PaginatedResponse<ICourseDto> | null>
    createCourseWithImage(courseData: ICourseFullData, file: Express.Multer.File, tutorId: string):Promise<IServiceResponse<boolean>>
    getCourseDetails(id:string):Promise<ICourseCategoryDto | null>
    editCourseWithImage(id: string,fields: any,file: Express.Multer.File | undefined):Promise<IServiceResponse<ICourseDto> | null>
    createSection(id:string,sectionData:ISectionData):Promise<ISectionDto | null>
    createLecture(data:ILectureData):Promise<ILectureDto | null>
    getSections(id:string):Promise<ISectionDto[] | null>
    getLectures(id:string):Promise<ILectureDto[] | null>
    editLecture(id:string,title:string):Promise<ILectureDto | null>
    deleteLecture(id:string):Promise<boolean | null>
    editSection(id:string,data:ISectionData):Promise<ISectionDto | null >

    uploadLectureVideo(lectureId: string, videoFile: Express.Multer.File): Promise<string | null>;
    
    applyReview(courseId:string):Promise<boolean | null>
    getNotifications(receiverId:string):Promise<INotificationDto[] | null>
    readNotifications(id:string):Promise<boolean | null>
    getStudents(tutorId:string,page:number,limit:number):Promise<StudentsResponseDataType | null>
    getCoursePreview(courseId:string):Promise<ICourseDto | null>
    getSectionsPreview(courseId:string):Promise<ISectionDto[] | null>
    getLecturesPreview(sectionId:string):Promise<ILectureDto[] | null>
    getReviews(courseId:string):Promise<IReviewDto[] | null>
    replyReview(reviewId:string,reply:string):Promise<IReviewResponseDto | null>
    deleteReply(reviewId:string):Promise<boolean | null>

}

export default ITutorCourseService