import { Tutor, ITutor } from '../../../model/tutor/tutorModel';
import ITutorRepository from '../ITutorRepository'
import { OTP,OTPType } from '../../../model/otp/ otpModel';
import { BaseRepository } from '../../base/implementation/BaseRepository';

class TutorRepository extends BaseRepository<ITutor> implements ITutorRepository{

    constructor(){
        super(Tutor)
    }

    async findByEmail(email: string): Promise<ITutor | null> {
        const getUser = await Tutor.findOne({email :  email});
        return getUser;
    }

    // async createUser(username: string, email: string, password: string): Promise<ITutor | null> {
    //     const newUser = await Tutor.create({username,email,password});
    //     return newUser;
    // }
    async createGoogleUser(username: string, email: string, password: string, image: string): Promise<ITutor | null> {
        const newUser = await Tutor.create({
            username,
            email,
            password,
            profile: {
                profilePicture: image,  
            },
        });
        return newUser;
    }
    

    async updateUserByEmail(email: string, data:ITutor): Promise<ITutor | null> {
        const updatedUser = await Tutor.findOneAndUpdate({ email }, data,{ new:true })
        return updatedUser
    }

    async storeOtpInDb(email: string, otp: string): Promise<OTPType | null> {
        const storedOtp = await OTP.create({email,otp})
        return storedOtp
    }

    async findOtpByemail(email: string): Promise<OTPType | null> {
        const otp = await OTP.findOne({email :  email});
        return otp;
    }

    async storeResendOtpInDb(email: string, otp: string): Promise<OTPType | null> {
        const storedOtp = await OTP.findOneAndUpdate({email},{otp},{new:true})
        return storedOtp
    }

    // async loginUser(email:string, password:string): Promise<ITutor | null> {
    //     const user = await Tutor.findOne({email})
    //     return user
    // }
    async getTutorById(id: string): Promise<ITutor | null> {
        const tutor = await Tutor.findById(id)
        return tutor
    }
}

export default TutorRepository;