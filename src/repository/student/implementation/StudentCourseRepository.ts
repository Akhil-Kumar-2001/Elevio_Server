import { Course, ICourse } from "../../../model/course/courseModel";
import IStudentCourseRepository from "../IStudentCourseRepository";

class StudentCourseRepository implements IStudentCourseRepository {
    async getListedCourse(): Promise<ICourse[] | null> {

        const courses = await Course.find({ status: "listed" });
        return courses;
    }
}

export default StudentCourseRepository