import { CourseData } from "../../../Types/basicTypes";
import ITutorCourseRepository from "../ITutorCourseRepository";
import { Course } from "../../../model/course/courseModel";
import { Category, ICategory } from "../../../model/category/categoryModel";

class TutorCourseRepository implements ITutorCourseRepository {

    async getCategories(): Promise<ICategory[] | null> {
            const categories = await Category.find();
            return categories
        }

    async createCourse(courseData: CourseData): Promise<boolean | null> {
        try {
            const newCourse = new Course(courseData);
            await newCourse.save();
            return true;
        } catch (error) {
            console.error("Error creating course:", error);
            return null;
        }
    }
}

export default TutorCourseRepository;
