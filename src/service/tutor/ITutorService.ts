import { ITutor } from "../../model/tutor/tutorModel"
import { OTPType } from "../../model/otp/ otpModel"

interface ITutorService{
    findByEmail(email:string):Promise<ITutor | null>
    createUser(username:string, email:string, password:string):Promise<ITutor | null>
    createGoogleUser(username:string, email:string, password:string,image:string):Promise<ITutor | null>
    updateUser(email:string, data:ITutor):Promise<ITutor | null>
    storeUserOtp(email:string, otp:string):Promise<OTPType | null> 
    getOtpByEmail(email:string):Promise<OTPType | null>
    storeUserResendOtp(email:string, otp:string):Promise<OTPType | null> 
    getTutorById(id:string):Promise<ITutor | null>
}

export default ITutorService