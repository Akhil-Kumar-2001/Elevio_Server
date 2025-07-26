import { ISessionDto } from "../../dtos/session/sessionDto";
import { IStudentDto } from "../../dtos/student/studentDto";
import { ISubscriptionPurchasDto } from "../../dtos/subsription/isSubsriptionPurchasedDto";
import { EditStudentType, SessionInfo } from "../../Types/basicTypes";

interface IStudentProfileService{
    getStudent(id:string):Promise<IStudentDto | null>;
    getSubscriptionDetails(id:string):Promise<ISubscriptionPurchasDto | null>;
    editProfile(id:string,formData:EditStudentType):Promise<IStudentDto | null>
    getSessions(studentId:string):Promise<SessionInfo[] | null>
    getSessionDetails(_id:string):Promise<ISessionDto | null>
    updateSessionStatus(_id:string,status:string):Promise<boolean | null>
}

export default  IStudentProfileService
