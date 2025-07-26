import { IOtpDto } from "../../dtos/otp/IOtpDto";
import { IStudentDto } from "../../dtos/student/studentDto";
import { IStudent } from "../../model/student/studentModel";

interface IStudentService {
    findByEmail(email:string):Promise<IStudent | null>
    createUser(username:string, email:string, password:string):Promise<IStudent | null>
    updateUser(email:string, data:IStudent):Promise<IStudentDto | null>
    updateUserStatus(email:string):Promise<IStudentDto | null>
    storeUserOtp(email:string, otp:string):Promise<IOtpDto | null> 
    getOtpByEmail(email:string):Promise<IOtpDto | null>
    storeUserResendOtp(email:string, otp:string):Promise<IOtpDto | null> 
    isBlocked(_id:string):Promise<number | undefined>

}

export default IStudentService; 