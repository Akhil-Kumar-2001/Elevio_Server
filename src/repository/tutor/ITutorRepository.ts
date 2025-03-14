import { ITutor } from "../../model/tutor/tutorModel"
import { OTPType } from "../../model/otp/ otpModel"
import { IBaseRepository } from "../base/IBaseRepository"

interface ITutorRepository extends IBaseRepository<ITutor>{
    findByEmail(email:string):Promise<ITutor | null>
    // createUser(username:string,email:string,password:string):Promise<ITutor | null>
    createGoogleUser(username:string,email:string,password:string,image:string):Promise<ITutor | null>
    updateUserByEmail(email:string, data:ITutor):Promise<ITutor | null> 
    storeOtpInDb(email:string, otp:string):Promise<OTPType | null>
    findOtpByemail(email:string):Promise<OTPType | null>
    storeResendOtpInDb(email:string, otp:string):Promise<OTPType | null>
    // loginUser(email:string, password:string): Promise<ITutor | null>
    getTutorById(id:string):Promise<ITutor | null>

}

export default ITutorRepository