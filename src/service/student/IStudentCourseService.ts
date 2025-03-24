import { ICourse } from "../../model/course/courseModel"

interface IStudentCourseService {
    getListedCourse():Promise<ICourse[] | null>
}
export default IStudentCourseService