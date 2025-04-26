import { ISession } from "../../model/sessiion/sessionModel"
import { IStudent } from "../../model/student/studentModel"
import { ISubscriptionPurchased } from "../../model/subscription/SubscriptionPurchased"
import { EditStudentType, IStudentResponse, SessionInfo } from "../../Types/basicTypes"


interface IStudentProfileRepository{
    getStudent(id:string):Promise<IStudent | null>
    getSubscriptionDetails(id:string):Promise<ISubscriptionPurchased | null>
    editProfile(id:string,formData:EditStudentType):Promise<IStudent | null>
    getSessions(studentId:string):Promise<SessionInfo[] | null>
    getSessionDetails(_id:string):Promise<ISession | null>
    updateSessionStatus(_id:string,status:string):Promise<boolean | null>
}
export default IStudentProfileRepository