import { ITutor } from '../../../model/tutor/tutorModel';
import { OTPType } from '../../../model/otp/ otpModel';
import ITutorRepository from '../../../repository/tutor/implementation/TutorRepository'
import ITutorService from '../ITutorService';

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

    async updateUser(email: string, data:ITutor): Promise<ITutor | null> {
        const updatedUser = await this._tutorRepository.updateUserByEmail(email,data);
        return updatedUser
    }

    async storeUserOtp(email: string, otp: string): Promise<OTPType | null> {
        const storedOtp = await this._tutorRepository.storeOtpInDb(email,otp);
        return storedOtp
    }
    
    async getOtpByEmail(email: string): Promise<OTPType | null> {
        const otp = await this._tutorRepository.findOtpByemail(email)
        return otp
    }
    async storeUserResendOtp(email: string, otp: string): Promise<OTPType | null> {
        const storedOtp = await this._tutorRepository.storeResendOtpInDb(email,otp);
        return storedOtp
    }

    // async loginUser(email: string, password: string): Promise<ITutor | null> {
    //     const user = await this._tutorRepository.loginUser(email,password);
    //     return user
    // }
    async getTutorById(id: string): Promise<ITutor | null> {
        const tutor = await this._tutorRepository.getTutorById(id);
        return tutor
    }
}

export default TutorService;