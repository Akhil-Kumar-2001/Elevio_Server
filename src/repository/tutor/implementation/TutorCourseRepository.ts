import { CourseData } from "../../../Types/basicTypes";
import ITutorCourseRepository from "../ITutorCourseRepository";
import { Course, ICourse } from "../../../model/course/courseModel";
import { Category, ICategory } from "../../../model/category/categoryModel";
import { CourseResponseDataType } from "../../../Types/CategoryReturnType";

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

    async getCourses(page: number, limit: number): Promise<CourseResponseDataType | null> {
        try {
            const skip = (page - 1) * limit;
            const courses = await Course.find().sort({ createAt: -1 }).skip(skip).limit(limit).exec()
            const totalRecord = await Course.countDocuments()
            return { courses, totalRecord }
        } catch (error) {
            console.log("Error while retrieving courses")
            return null
        }
    }

    async getCourseDetails(id: string): Promise<ICourse | null> {
        try {
            const courseDetails = await Course.findById(id).populate('category', 'name');
            return courseDetails
        } catch (error) {
            console.log("Error while retrieving course details")
            return null
        }
    }
    
    async editCourse(id: string, editCourse: ICourse): Promise<ICourse | null> {
        try {
            const updatedCourse = await Course.findByIdAndUpdate(
                id,
                { $set: editCourse },
                { new: true}
            );
            return updatedCourse
        } catch (error) {
            console.log("Error while updating course details")
            return null
        }
    }
}

export default TutorCourseRepository;
