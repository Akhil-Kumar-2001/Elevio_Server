import { OTPType } from "../../model/otp/ otpModel";
import { IStudent } from "../../model/student/studentModel";

interface IStudentService {
    findByEmail(email:string):Promise<IStudent | null>
    createUser(username:string, email:string, password:string):Promise<IStudent | null>
    updateUser(email:string, data:IStudent):Promise<IStudent | null>
    storeUserOtp(email:string, otp:string):Promise<OTPType | null> 
    getOtpByEmail(email:string):Promise<OTPType | null>
    storeUserResendOtp(email:string, otp:string):Promise<OTPType | null> 
    // loginUser(email:string,password:string):Promise<IStudent | null>
    isBlocked(_id:string):Promise<number | undefined>

}

export default IStudentService; 