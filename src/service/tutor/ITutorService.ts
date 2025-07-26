import { ITutor } from "../../model/tutor/tutorModel"
import { OTPType } from "../../model/otp/ otpModel"
import { ITutorDto } from "../../dtos/tutor/tutorDto"
import { IOtpDto } from "../../dtos/otp/IOtpDto"

interface ITutorService{
    findByEmail(email:string):Promise<ITutor | null>
    createUser(username:string, email:string, password:string):Promise<ITutor | null>
    createGoogleUser(username:string, email:string, password:string,image:string):Promise<ITutor | null>
    updateUser(email:string, data:ITutor):Promise<ITutorDto | null>
    storeUserOtp(email:string, otp:string):Promise<IOtpDto | null> 
    getOtpByEmail(email:string):Promise<IOtpDto | null>
    storeUserResendOtp(email:string, otp:string):Promise<IOtpDto | null> 
    getTutorById(id:string):Promise<ITutorDto | null>
}

export default ITutorService