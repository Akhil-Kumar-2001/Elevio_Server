import { TutorType } from '../../../model/tutor/tutorModel';
import { OTPType } from '../../../model/otp/ otpModel';
import ITutorProfileRepository from '../../../repository/tutor/implementation/TutorProfileRepository'
import ITutorProfileService from '../ITutorProfileService';
import { TutorVerificationFormData } from '../../../Types/basicTypes';

class TutorProfileService implements ITutorProfileService{

    private _tutorProfileRepository:ITutorProfileRepository;
    constructor(tutorProfileRepository:ITutorProfileRepository){
        this._tutorProfileRepository = tutorProfileRepository
    }

    
    async getTutorById(id: string): Promise<TutorType | null> {
        const tutor = await this._tutorProfileRepository.getTutorById(id);
        return tutor
    }

    async verifyTutor(formData: TutorVerificationFormData): Promise<TutorType | null> {
        const tutor = await this._tutorProfileRepository.verifyTutor(formData);
            return tutor
        
    }
    
}

export default TutorProfileService;