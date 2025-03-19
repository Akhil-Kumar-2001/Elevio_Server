import { ICategory } from "../../model/category/categoryModel"
import { ICourse } from "../../model/course/courseModel"
import { CourseData } from "../../Types/basicTypes"
import { CourseResponseDataType } from "../../Types/CategoryReturnType"

interface ITutorCourseService {
    getCategories(): Promise<ICategory[] | null>
    createCourse(courseData: CourseData): Promise<boolean | null>
    getCourses(page:number,limit:number): Promise<CourseResponseDataType | null>
    getCourseDetails(id:string):Promise<ICourse | null>
    editCourse(id:string,editedCourse:ICourse):Promise<ICourse | null>

}

export default ITutorCourseService