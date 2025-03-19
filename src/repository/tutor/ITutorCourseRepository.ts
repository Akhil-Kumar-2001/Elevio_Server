import { ICategory } from "../../model/category/categoryModel"
import { ICourse } from "../../model/course/courseModel"
import { CourseData } from "../../Types/basicTypes"
import { CourseResponseDataType } from "../../Types/CategoryReturnType"

interface ITutorCourseRepository{
    createCourse(courseData:CourseData):Promise<boolean | null>
    getCategories():Promise<ICategory[] | null>
    getCourses(page:number,limit:number):Promise<CourseResponseDataType | null >
    getCourseDetails(id:string):Promise<ICourse | null >
    editCourse(id:string,editCourse:ICourse):Promise<ICourse | null>
}

export default ITutorCourseRepository
