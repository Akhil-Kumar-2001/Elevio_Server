import { ICategory } from "../../model/category/categoryModel"
import { ICourse } from "../../model/course/courseModel"
import { ILecture } from "../../model/lecture/lectureModel"
import { ISection } from "../../model/section/sectionModel"
import { CourseData, ILectureData, ISectionData } from "../../Types/basicTypes"
import { CourseResponseDataType } from "../../Types/CategoryReturnType"

interface ITutorCourseService {
    getCategories(): Promise<ICategory[] | null>
    createCourse(courseData: CourseData): Promise<boolean | null>
    getCourses(page:number,limit:number): Promise<CourseResponseDataType | null>
    getCourseDetails(id:string):Promise<ICourse | null>
    editCourse(id:string,editedCourse:ICourse):Promise<ICourse | null>
    createSection(id:string,sectionData:ISectionData):Promise<ISection | null>
    createLecture(data:ILectureData):Promise<ILecture | null>
    getSections(id:string):Promise<ISection[] | null>
    getLectures(id:string):Promise<ILecture[] | null>
    editLecture(id:string,title:string):Promise<ILecture | null>
    deleteLecture(id:string):Promise<boolean | null>

    uploadLectureVideo(lectureId: string, videoFile: Express.Multer.File): Promise<string | null>;
    
    applyReview(courseId:string):Promise<boolean | null>

}

export default ITutorCourseService