import { ICategory } from "../../model/category/categoryModel"
import { CourseData } from "../../Types/basicTypes"

interface ITutorCourseService {
    getCategories(): Promise<ICategory[] | null>
    createCourse(courseData: CourseData): Promise<boolean | null>

}

export default ITutorCourseService