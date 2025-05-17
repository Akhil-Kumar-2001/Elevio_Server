import { ICategory } from "../../model/category/categoryModel"
import { ICourse } from "../../model/course/courseModel"
import { ILecture } from "../../model/lecture/lectureModel"
import { INotification } from "../../model/notification/notification.Model"
import { IReview } from "../../model/review/review.model"
import { ISection } from "../../model/section/sectionModel"
import { CourseData,  ILectureData, ISectionData } from "../../Types/basicTypes"
import { CourseResponseDataType, StudentsResponseDataType } from "../../Types/CategoryReturnType"

interface ITutorCourseRepository {
    isTutorVerified(tutorId: string): Promise<boolean | null>
    createCourse(courseData: CourseData): Promise<boolean | null>
    getCategories(): Promise<ICategory[] | null>
    getCourses(tutorId:string,page: number, limit: number): Promise<CourseResponseDataType | null>
    getCourseDetails(id: string): Promise<ICourse | null>
    editCourse(id: string, editCourse: ICourse): Promise<ICourse | null>
    createSection(id: string, sectionData: ISectionData): Promise<ISection | null>
    createLecture(data: ILectureData): Promise<ILecture | null>
    getSections(id: string): Promise<ISection[] | null>
    getLectures(id: string): Promise<ILecture[] | null>
    editLecture(id: string, title: string): Promise<ILecture | null>
    deleteLecture(id: string): Promise<boolean | null>
    editSection(id:string,data:ISectionData):Promise<ISection | null>

    uploadLectureVideo(lectureId: string, videoFile: Express.Multer.File): Promise<string | null>;

    applyReview(courseId:string):Promise<boolean | null>;
    getNotifications(receiverId:string):Promise<INotification[] | null>;
    readNotifications(id:string):Promise<boolean | null>;
    getStudents(tutorId:string,page:number,limit:number):Promise<StudentsResponseDataType | null>;
    getCoursePreview(courseId:string):Promise<ICourse | null>;
    getSectionsPreview(courseId:string):Promise<ISection[] | null>;
    getLecturesPreview(sectionId:string):Promise<ILecture[] | null>;
    getReviews(courseId:string):Promise<any | null>;
    replyReview(reviewId:string,reply:string):Promise<IReview | null>;
    deleteReply(reviewId:string):Promise<boolean | null>;
}

export default ITutorCourseRepository
