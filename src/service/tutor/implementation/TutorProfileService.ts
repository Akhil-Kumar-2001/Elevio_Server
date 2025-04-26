import { ITutor } from '../../../model/tutor/tutorModel';
import ITutorProfileRepository from '../../../repository/tutor/ITutorProfileRepository'
import ITutorProfileService from '../ITutorProfileService';
import { SessionInfo, TutorVerificationFormData } from '../../../Types/basicTypes';
import { ICategory } from '../../../model/category/categoryModel';
import { ISession } from '../../../model/sessiion/sessionModel';

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
    
    async sessionExist(sessionData: ISession): Promise<boolean | null> {
        const response = await this._tutorProfileRepository.sessionExist(sessionData);
        return response;
    }

    async createSession(sessionData: ISession): Promise<boolean | null> {
        const response = await this._tutorProfileRepository.createSession(sessionData);
        return response;
    }

    async getSessions(tutorId: string): Promise<SessionInfo[] | null> {
        const response = await this._tutorProfileRepository.getSessions(tutorId);
        return response;
    }

    async getSessionDetails(id: string): Promise<ISession | null> {
        const response = await this._tutorProfileRepository.getSessionDetails(id);
        return response;
    }

    async updateSessionStatus(_id: string,status:string): Promise<boolean | null> {
        const response = await this._tutorProfileRepository.updateSessionStatus(_id,status);
        return response;
    }

}

export default TutorProfileService;