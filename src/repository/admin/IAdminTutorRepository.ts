import { ICategory } from "../../model/category/categoryModel"
import { ICourse } from "../../model/course/courseModel"
import { ILecture } from "../../model/lecture/lectureModel"
import { ISection } from "../../model/section/sectionModel"
import { ITutor } from "../../model/tutor/tutorModel"
import { CategoryResponseDataType, CourseResponseDataType } from "../../Types/CategoryReturnType"

interface IAdminTutorRepository {
    getPendingTutors(): Promise<ITutor[] | null>
    getTutorById(id: string): Promise<ITutor | null>
    rejectTutor(id: string): Promise<boolean | null>
    approveTutor(id: string): Promise<boolean | null>
    findCategory(name: string): Promise<boolean | null>
    createCategory(name: string): Promise<boolean | null>
    getCategories(page: number, limit: number): Promise<CategoryResponseDataType | null>
    blockCategory(id: string): Promise<ICategory | null>
    deleteCategory(id: string): Promise<boolean | null>
    pendingCourse(page:number,limit:number): Promise<CourseResponseDataType | null>
    getCategory(): Promise<ICategory[] | null>
    courseDetails(id:string):Promise<ICourse | null>
    getSections(id:string):Promise<ISection[] | null>
    getLectures(id: string): Promise<ILecture[] | null>
    rejectCourse(id:string,reason:string):Promise<boolean | null>
    approveCourse(id:string):Promise<boolean | null>


}

export default IAdminTutorRepository