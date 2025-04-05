import { IStudent } from "../../model/student/studentModel"
import { ISubscriptionPurchased } from "../../model/subscription/SubscriptionPurchased"
import { EditStudentType, IStudentResponse } from "../../Types/basicTypes"


interface IStudentProfileRepository{
    getStudent(id:string):Promise<IStudent | null>
    getSubscriptionDetails(id:string):Promise<ISubscriptionPurchased | null>
    editProfile(id:string,formData:EditStudentType):Promise<IStudent | null>
}
export default IStudentProfileRepository