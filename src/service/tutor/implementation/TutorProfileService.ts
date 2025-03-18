import { ITutor } from '../../../model/tutor/tutorModel';
import ITutorProfileRepository from '../../../repository/tutor/ITutorProfileRepository'
import ITutorProfileService from '../ITutorProfileService';
import { TutorVerificationFormData } from '../../../Types/basicTypes';
import { ICategory } from '../../../model/category/categoryModel';

class TutorProfileService implements ITutorProfileService{

    private _tutorProfileRepository:ITutorProfileRepository;
    constructor(tutorProfileRepository:ITutorProfileRepository){
        this._tutorProfileRepository = tutorProfileRepository
    }

    
    async getTutorById(id: string): Promise<ITutor | null> {
        const tutor = await this._tutorProfileRepository.getTutorById(id);
        return tutor
    }

    async verifyTutor(formData: TutorVerificationFormData): Promise<ITutor | null> {
        const tutor = await this._tutorProfileRepository.verifyTutor(formData);
            return tutor
        
    }

    async updateProfile(id: string, formData: ITutor): Promise<boolean | null> {
        const updatedTutor = await this._tutorProfileRepository.updateProfile(id,formData);
        return updatedTutor
    }
    
}

export default TutorProfileService;