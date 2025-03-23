import { ICategory } from "../../../model/category/categoryModel";
import { ICourse } from "../../../model/course/courseModel";
import { ILecture } from "../../../model/lecture/lectureModel";
import { ISection } from "../../../model/section/sectionModel";
import { ITutor } from "../../../model/tutor/tutorModel";
import IAdminTutorRepository from "../../../repository/admin/IAdminTutorRepository";
import { CategoryResponseDataType, CourseResponseDataType } from "../../../Types/CategoryReturnType";
import IAdminTutorService from "../IAdminTutorService";

class AdminTutorService implements IAdminTutorService {

    private _adminTutorRepository: IAdminTutorRepository;

    constructor(adminTutorRepository: IAdminTutorRepository) {
        this._adminTutorRepository = adminTutorRepository;

    }
    async getPendingTutors(): Promise<ITutor[] | null> {
        const tutors = await this._adminTutorRepository.getPendingTutors()
        return tutors
    }
    async getTutorById(id: string): Promise<ITutor | null> {
        const tutor = await this._adminTutorRepository.getTutorById(id);
        return tutor
    }

    async rejectTutor(id: string): Promise<boolean | null> {
        const reject = await this._adminTutorRepository.rejectTutor(id)
        return reject
    }

    async approveTutor(id: string): Promise<boolean | null> {
        const approve = await this._adminTutorRepository.approveTutor(id)
        return approve
    }

    async findCategory(name: string): Promise<boolean | null> {
        const category = await this._adminTutorRepository.findCategory(name);
        return category
    }

    async createCategory(name: string): Promise<boolean | null> {
        const category = await this._adminTutorRepository.createCategory(name);
        return category
    }

    async getCategories(page: number, limit: number): Promise<CategoryResponseDataType | null> {
        const categories = await this._adminTutorRepository.getCategories(page, limit);
        return categories
    }

    async blockCategory(id: string): Promise<ICategory | null> {
        const response = await this._adminTutorRepository.blockCategory(id);
        return response
    }

    async deleteCategory(id: string): Promise<boolean | null> {
        const response = await this._adminTutorRepository.deleteCategory(id);
        return response
    }

    async pendingCourse(page:number,limit:number): Promise<CourseResponseDataType | null> {
        const response = await this._adminTutorRepository.pendingCourse(page,limit);
        return response
    }


    async getCategory(): Promise<ICategory[] | null> {
        const categories = await this._adminTutorRepository.getCategory();
        return categories
    }

    async courseDetails(id: string): Promise<ICourse | null> {
        const course = await this._adminTutorRepository.courseDetails(id);
        return course;
    }
    async getSections(id: string): Promise<ISection[] | null> {
        const sections = await this._adminTutorRepository.getSections(id);
        return sections;
    }

    async getLectures(id: string): Promise<ILecture[] | null> {
        const response = await this._adminTutorRepository.getLectures(id);
        return response
    }

    async rejectCourse(id: string, reason: string): Promise<boolean | null> {
        const response = await this._adminTutorRepository.rejectCourse(id,reason);
        return response;
    }

    async getTutorMail(tutorId: string): Promise<string | null> {
        const email = await this._adminTutorRepository.getTutorMail(tutorId)
        return email
    }

    async approveCourse(id: string): Promise<boolean | null> {
        const response = await this._adminTutorRepository.approveCourse(id);
        return response;
    }
}

export default AdminTutorService