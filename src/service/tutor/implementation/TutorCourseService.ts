import { ICategory } from "../../../model/category/categoryModel";
import { ICourse } from "../../../model/course/courseModel";
import ITutorCourseRepository from "../../../repository/tutor/ITutorCourseRepository";
import { CourseData } from "../../../Types/basicTypes";
import { CourseResponseDataType } from "../../../Types/CategoryReturnType";
import ITutorCourseService from "../ITutorCourseService";

class TutorCourseService implements ITutorCourseService{

    private _tutorProfileRepository:ITutorCourseRepository;
    constructor(tutorProfileRepository:ITutorCourseRepository){
        this._tutorProfileRepository = tutorProfileRepository
    }

    async getCategories():Promise<ICategory[] | null> {
            const categories = await this._tutorProfileRepository.getCategories();
            return categories
        }

    async createCourse(courseData: CourseData): Promise<boolean | null> {
        const response = await this._tutorProfileRepository.createCourse(courseData);
        return response
    }

    async getCourses(page: number, limit: number): Promise<CourseResponseDataType | null> {
        const response = await this._tutorProfileRepository.getCourses(page,limit);
        return response;
    }

    async getCourseDetails(id:string):Promise<ICourse | null> {
        const response = await this._tutorProfileRepository.getCourseDetails(id);
        return response;
    }

    async editCourse(id: string, editedCourse: ICourse): Promise<ICourse | null> {
        const response = await this._tutorProfileRepository.editCourse(id,editedCourse);
        return response
    }
}

export default TutorCourseService