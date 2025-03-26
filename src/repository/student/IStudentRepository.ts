import { ICourse } from "../../model/course/courseModel";
import { OTPType } from "../../model/otp/ otpModel";
import { IStudent } from "../../model/student/studentModel";
import { EditStudentType } from "../../Types/basicTypes";
import { IBaseRepository } from "../base/IBaseRepository";

interface IStudentRepository extends IBaseRepository<IStudent> {

    findByEmail(email:string):Promise<IStudent | null>
    // createUser(username:string,email:string,password:string):Promise<IStudent | null>
    updateUserByEmail(email:string, data:IStudent):Promise<IStudent | null>
    storeOtpInDb(email:string, otp:string):Promise<OTPType | null>
    findOtpByemail(email:string):Promise<OTPType | null>
    storeResendOtpInDb(email:string, otp:string):Promise<OTPType | null>
    // loginUser(email:string, password:string): Promise<IStudent | null>
    isBlocked(_id:string):Promise<number | undefined>

}


export default IStudentRepository;