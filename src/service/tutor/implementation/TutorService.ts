import { ITutor } from '../../../model/tutor/tutorModel';
import { OTPType } from '../../../model/otp/ otpModel';
import ITutorRepository from '../../../repository/tutor/implementation/TutorRepository'
import ITutorService from '../ITutorService';
import { ITutorDto } from '../../../dtos/tutor/tutorDto';
import { mapTutorToDto } from '../../../mapper/tutor/tutorMapper';
import { IOtpDto } from '../../../dtos/otp/IOtpDto';
import { mapOtpToDto } from '../../../mapper/otp/otpMapper';

class TutorService implements ITutorService{

    private _tutorRepository:ITutorRepository;
    constructor(tutorRepository:ITutorRepository){
        this._tutorRepository = tutorRepository
    }

    async findByEmail(email: string): Promise<ITutor | null> {
        const getUser = await this._tutorRepository.findByEmail(email)
        return getUser
    }

    async createUser(username: string, email: string, password: string): Promise<ITutor | null> {
        const newUser = await this._tutorRepository.create({username,email,password})
        return newUser;
    }
    async createGoogleUser(username: string, email: string, password: string,image:string): Promise<ITutor | null> {
        const newUser = await this._tutorRepository.createGoogleUser(username,email,password,image)
        return newUser;
    }

    async updateUser(email: string, data:ITutor): Promise<ITutorDto | null> {
        const updatedUser = await this._tutorRepository.updateUserByEmail(email,data);
        if(!updatedUser)return null;
        const dto = mapTutorToDto(updatedUser);
        return dto;
    }

    async storeUserOtp(email: string, otp: string): Promise<IOtpDto | null> {
        const storedOtp = await this._tutorRepository.storeOtpInDb(email,otp);
        if(!storedOtp)return null;
        const dto = mapOtpToDto(storedOtp);
        return dto;
    }
    
    async getOtpByEmail(email: string): Promise<IOtpDto | null> {
        const otp = await this._tutorRepository.findOtpByemail(email)
        if(!otp)return null;
        const dto = mapOtpToDto(otp);
        return dto;
    }
    async storeUserResendOtp(email: string, otp: string): Promise<IOtpDto | null> {
        const storedOtp = await this._tutorRepository.storeResendOtpInDb(email,otp);
        if(!storedOtp)return null;
        const dto = mapOtpToDto(storedOtp);
        return dto;
    }


    async getTutorById(id: string): Promise<ITutorDto | null> {
        const tutor = await this._tutorRepository.getTutorById(id);
        if(!tutor)return null;
        const dto = mapTutorToDto(tutor);
        return dto;
    }
}

export default TutorService;