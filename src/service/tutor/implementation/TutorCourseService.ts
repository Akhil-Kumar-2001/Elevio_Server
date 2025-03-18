import { ICategory } from "../../../model/category/categoryModel";
import ITutorCourseRepository from "../../../repository/tutor/ITutorCourseRepository";
import { CourseData } from "../../../Types/basicTypes";
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
}

export default TutorCourseService