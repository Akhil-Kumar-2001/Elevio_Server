import { ICourse } from "../../model/course/courseModel";

interface IStudentCourseRepository {
    getListedCourse():Promise<ICourse[] | null>
}

export default IStudentCourseRepository;