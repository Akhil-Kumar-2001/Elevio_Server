import { TutorType } from "../../../model/tutor/tutorModel";
import IAdminTutorRepository from "../../../repository/admin/IAdminTutorRepository";
import IAdminTutorService from "../IAdminTutorService";

class AdminTutorService implements IAdminTutorService {

    private _adminTutorRepository: IAdminTutorRepository;

    constructor(adminTutorRepository: IAdminTutorRepository) {
        this._adminTutorRepository = adminTutorRepository;

    }
    async getPendingTutors(): Promise<TutorType[] | null> {
        const tutors = await this._adminTutorRepository.getPendingTutors()
        return tutors
    }
    async getTutorById(id: string): Promise<TutorType | null> {
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

}

export default AdminTutorService