import { ITutor } from '../../../model/tutor/tutorModel';
import ITutorProfileRepository from '../../../repository/tutor/ITutorProfileRepository'
import ITutorProfileService from '../ITutorProfileService';
import { SessionInfo, TutorVerificationFormData } from '../../../Types/basicTypes';
import { ISession } from '../../../model/sessiion/sessionModel';
import { ITutorDto } from '../../../dtos/tutor/tutorDto';
import { mapTutorToDto } from '../../../mapper/tutor/tutorMapper';
import { ISessionDto } from '../../../dtos/session/sessionDto';
import { mapSessionToDto } from '../../../mapper/session/sessionMapper';

class TutorProfileService implements ITutorProfileService{

    private _tutorProfileRepository:ITutorProfileRepository;
    constructor(tutorProfileRepository:ITutorProfileRepository){
        this._tutorProfileRepository = tutorProfileRepository
    }

    
    async getTutorById(id: string): Promise<ITutorDto | null> {
        const tutor = await this._tutorProfileRepository.getTutorById(id);
        if(!tutor)return null;
        const dto = mapTutorToDto(tutor);
        return dto;
    }

    async verifyTutor(formData: TutorVerificationFormData): Promise<ITutorDto | null> {
        const tutor = await this._tutorProfileRepository.verifyTutor(formData);
        if(!tutor)return null;
        const dto = mapTutorToDto(tutor);
        return dto;
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

    async getSessionDetails(id: string): Promise<ISessionDto | null> {
        const response = await this._tutorProfileRepository.getSessionDetails(id);
        if(!response)return null;
        const dto = mapSessionToDto(response);
        return dto;
    }

    async updateSessionStatus(_id: string,status:string): Promise<boolean | null> {
        const response = await this._tutorProfileRepository.updateSessionStatus(_id,status);
        return response;
    }

}

export default TutorProfileService;