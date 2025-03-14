import { ICategory } from "../../../model/category/categoryModel";
import { ITutor } from "../../../model/tutor/tutorModel";
import IAdminTutorRepository from "../../../repository/admin/IAdminTutorRepository";
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
        const category = await this. _adminTutorRepository.createCategory(name);
        return category
    }

    async getCategories(): Promise<ICategory[] | null> {
        const categories = await this._adminTutorRepository.getCategories();
        return categories
    }

    async blockCategory(id: string): Promise<ICategory | null> {
        const response = await this._adminTutorRepository.blockCategory(id);
        return response
    }

}

export default AdminTutorService