import { ICategory } from "../../model/category/categoryModel"
import { CourseData } from "../../Types/basicTypes"

interface ITutorCourseRepository{
    createCourse(courseData:CourseData):Promise<boolean | null>
    getCategories():Promise<ICategory[] | null>
}

export default ITutorCourseRepository
